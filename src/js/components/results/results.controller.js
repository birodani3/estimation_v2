import NewTicketController from './modaldialogs/newticket/newticket.controller.js';
import ImportTicketsController from './modaldialogs/importtickets/importtickets.controller.js';
import SetStoryPointController from './modaldialogs/setstorypoint/setstorypoint.controller.js'
import ShowTicketController from './modaldialogs/showticket/showticket.controller.js'
import newTicketTemplate from './modaldialogs/newticket/newticket.html';
import importTicketsTemplate from './modaldialogs/importtickets/importtickets.html';
import setStoryPointTemplate from './modaldialogs/setstorypoint/setstorypoint.html'
import showTicketTemplate from './modaldialogs/showticket/showticket.html';
import _ from 'lodash';

const Tabs = {
    'ESTIMATE_TICKET': 0,
    'ESTIMATED_TICKETS': 1
};

/*@ngInject*/
export default class ResultController {
    constructor($scope, $rootScope, $timeout, $http, socket, hover, toast, $mdDialog, dragulaBagId, dragulaService, store) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.socket = socket;
        this.toast = toast;
        this.store = store;
        this.$mdDialog = $mdDialog;

        this.storyPoints = this.getStoryPoints();
        this.isFlipped = false;
        this.selectedTicket = null;
        this.activeTab = Tabs.ESTIMATE_TICKET;   
        this.cards = [];
        this.tickets = [];

        this.initSocket();
        this.initWatchers();

        hover.bag(dragulaBagId, $scope)
            .on('drop', this.onTicketDropped.bind(this))
            .use();
    }

    initSocket() {
        this.socket.on('USER_JOINED', this.$scope, this.onUserJoined.bind(this));
        this.socket.on('USER_LEFT', this.$scope, this.onUserLeft.bind(this));
        this.socket.on('USER_VOTED', this.$scope, this.onUserVoted.bind(this));
        this.socket.on('connect', this.$scope, this.onClientReconnected.bind(this));
        this.socket.on('disconnect', this.$scope, this.onClientDisconnected.bind(this));
    }

    initWatchers() {
        this.$scope.$watch(() => this.cards, () => {
            this.isFlipped = this.cards.every(card => card.value !== null);
        }, true);
    }

    onTicketDropped(event, element, target, source) {
        let droppedTicket = element.scope().ticket;
        let point = target.scope().point;
        let newStoryPoint = point ? point.label : null;

        droppedTicket.storyPoint = newStoryPoint;

        if (droppedTicket === this.selectedTicket) {
            this.selectedTicket = null;
        }
    }

    onUserJoined(user) {
        this.cards.push({
            name: user.name,
            id: user.id,
            value: null
        });
    }

    onUserLeft(user) {
        _.remove(this.cards, card => card.id === user.id);
    }

    onUserVoted(data) {
        let card = this.findCardById(data.id);

        if (card) {
            card.value = data.value;
        }
    }

    onClientReconnected() {
        let values = this.store
            .get('settings')
            .values
            .filter(value => value.checked)
            .map(value => value.label);

        let payload = {
            name: this.$rootScope.channel,
            values
        };

        this.socket.emit('CREATE_CHANNEL', payload);
    }

    onClientDisconnected() {
        this.cards = [];
        this.toast.warning('Connection lost, all users removed. Users will automatically rejoin after successful connection', 0);
    }

    openMenu($mdMenu, event) {
        $mdMenu.open(event);
    };

    hideStoryPoint(point) {
        point.isVisible = false;
    }

    showStoryPoint(point) {
        point.isVisible = true;
    }

    isShowTicketFabVisible() {
        return this.selectedTicket;
    }

    isResetFabVisible() {
        return this.activeTab === Tabs.ESTIMATE_TICKET && this.cards.length;
    }

    isHiddenPointsFabVisible() {
        const hasHiddenStoryPoint = this.storyPoints
            .filter(point => !point.isVisible)
            .length;

        return this.activeTab === Tabs.ESTIMATED_TICKETS && hasHiddenStoryPoint
    }

    isRemoveCardFabVisible() {
        return this.cards
            .filter(card => card.isSelected)
            .length;
    }

    isExportStoryPointsFabVisible() {
        return this.tickets.filter(tickets => tickets.storyPoint).length && this.activeTab === Tabs.ESTIMATED_TICKETS;
    }

    openCreateNewTicket(event) {
        this.$mdDialog.show({
            template: newTicketTemplate,
            controller: ['$scope', '$mdDialog', NewTicketController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#tickets-menu-button',
            closeTo: '#tickets-menu-button',
            clickOutsideToClose: true
        })
        .then((ticket) => {
            this.tickets.push(ticket);
        })
        .catch(() => {});
    }

    openImportTicketsDialog(event) {
        this.$mdDialog.show({
            template: importTicketsTemplate,
            controller: ['$scope', '$http', '$mdDialog', ImportTicketsController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#tickets-menu-button',
            closeTo: '#tickets-menu-button',
            clickOutsideToClose: true
        })
        .then((tickets) => {
            if (tickets && tickets.length) {
                tickets.forEach(ticket => ticket.isSelected = false);

                this.tickets.push(...tickets);
            }
        })
        .catch(() => {});
    }

    openShowTicketDialog() {
        this.$mdDialog.show({
            template: showTicketTemplate,
            controller: ['$scope', '$mdDialog', 'ticket', ShowTicketController],
            locals: { 
                ticket: this.selectedTicket
            },
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#show-ticket-menu-button',
            closeTo: '#show-ticket-menu-button',
            clickOutsideToClose: true
        })
        .then(() => {})
        .catch(() => {});
    }

    openSetStoryPointDialog() {
        this.$mdDialog.show({
            template: setStoryPointTemplate,
            controller: ['$scope', '$http', '$mdDialog', 'store', 'ticket', 'cards', SetStoryPointController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#set-story-points-button',
            closeTo: '#set-story-points-button',
            clickOutsideToClose: true,
            locals: {
                ticket: this.selectedTicket,
                cards: this.cards
            }
        })
        .then((storyPoint) => {
            this.selectedTicket.storyPoint = storyPoint;
        })
        .catch(() => {});
    }

    exportStoryPoints() {
        const config = {
            method: 'POST',
            url: '/jira/setStoryPoints',
            data: {
                tickets: this.tickets.filter(ticket => angular.isNumber(ticket.storyPoint))
            }
        };

        this.$http(config).then((response) => {
            if (response.data) {
                if (response.data === 'SUCCESS') {
                    this.toast.success('Export was successful');

                    this.tickets = this.tickets.filter(ticket => !angular.isNumber(ticket.storyPoint));

                    return;
                }
            }
                
            this.toast.error('Export was unsuccessful');
        });
    }

    reset() {
        this.socket.emit('RESET', () => {
            this.cards.forEach(card => card.value = null);
        });
    }

    toggleTicketSelection(ticket) {
        ticket.isSelected = !ticket.isSelected;

        if (ticket.isSelected) {
            this.selectedTicket = ticket;
            this.reset();
        } else {
            this.selectedTicket = null;
        }

        this.tickets
            .filter(ticket_ => ticket_ !== ticket)
            .forEach((ticket) => ticket.isSelected = false);
    }

    toggleCardSelection(cardToToggle) {
        cardToToggle.isSelected = !cardToToggle.isSelected;

        this.cards
            .filter(card => card !== cardToToggle)
            .forEach(card => card.isSelected = false);
    }

    removeSelectedCard() {
        let card = _.find(this.cards, card => card.isSelected);

        if (card) {
            this.socket.emit('REMOVE_USER', card, () => {
                _.pull(this.cards, card);
            });
        }
    }

    findCardById(id) {
        return _.find(this.cards, card => card.id === id);
    }

    getStoryPoints() {
        return this.store.get('settings')
            .values
            .filter(setting => setting.checked && angular.isNumber(setting.label))
            .map(value => ({
                label: value.label,
                isVisible: true
            }));
    }
}
