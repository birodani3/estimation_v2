declare function require(string): string;

import * as angular from 'angular';
import * as _ from 'lodash';

import { NewTicketController } from './modaldialogs/newticket/newticket.controller';
import { ImportTicketsController } from './modaldialogs/importtickets/importtickets.controller';
import { SetStoryPointController } from './modaldialogs/setstorypoint/setstorypoint.controller'
import { ShowTicketController } from './modaldialogs/showticket/showticket.controller';
import { Card, Ticket } from 'app/models'; 
import { ISocketService, IHoverService, IToastService, IStoreService } from 'app/services'; 

enum Tab {
    EstimateTicket,
    EstimatedTickets
};

interface StoryPoint {
    label: any;
    isVisible: boolean; 
}

/* @ngInject */
export class ResultsController {
    public Tab: typeof Tab = Tab;
    public storyPoints: StoryPoint[];
    public isFlipped: boolean;
    public selectedTicket: Ticket;
    public activeTab: Tab;
    public cards: Card[];
    public tickets: Ticket[];

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        private $http: ng.IHttpService,
        private socket: ISocketService,
        private hover: IHoverService,
        private toast: IToastService,
        private $mdDialog: ng.material.IDialogService,
        private dragulaBagId: string,
        private dragulaService: any,
        private store: IStoreService
    ) {
        this.storyPoints = this.getStoryPoints();
        this.selectedTicket = null;
        this.activeTab = Tab.EstimateTicket;   
        this.cards = [];
        this.tickets = [];

        this.initSocket();
        this.initWatchers();

        hover.bag(dragulaBagId, $scope)
            .on('drop', this.onTicketDropped.bind(this))
            .use();
    }

    initSocket(): void {
        this.socket.on('USER_JOINED', this.$scope, this.onUserJoined.bind(this));
        this.socket.on('USER_LEFT', this.$scope, this.onUserLeft.bind(this));
        this.socket.on('USER_VOTED', this.$scope, this.onUserVoted.bind(this));
        this.socket.on('connect', this.$scope, this.onClientReconnected.bind(this));
        this.socket.on('disconnect', this.$scope, this.onClientDisconnected.bind(this));
    }

    initWatchers(): void {
        this.$scope.$watch(() => this.cards, () => {
            this.isFlipped = this.cards.every(card => card.value !== null);
        }, true);
    }

    onTicketDropped(event: Event, element, target, source): void {
        let droppedTicket = element.scope().ticket;
        let point = target.scope().point;
        let newStoryPoint = point ? point.label : null;

        droppedTicket.storyPoint = newStoryPoint;

        if (droppedTicket === this.selectedTicket) {
            this.selectedTicket = null;
        }
    }

    onUserJoined(user): void {
        this.cards.push({
            name: user.name,
            id: user.id,
            value: null,
            isSelected: false
        });
    }

    onUserLeft(user): void {
        _.remove(this.cards, this.findCardById(user.id));
    }

    onUserVoted(data): void {
        let card = this.findCardById(data.id);

        if (card) {
            card.value = data.value;
        }
    }

    onClientReconnected(): void {
        const values = this.store
            .get('settings')
            .values
            .filter(value => value.checked)
            .map(value => value.label);

        const payload = {
            name: this.$rootScope.channel,
            values
        };

        this.socket.emit('CREATE_CHANNEL', payload);
    }

    onClientDisconnected(): void {
        this.cards = [];
        this.toast.warning('Connection lost, all users removed. Users will automatically rejoin after successful connection', 0);
    }

    openMenu($mdMenu, event: Event): void {
        $mdMenu.open(event);
    };

    hideStoryPoint(point: StoryPoint): void {
        if (this.tickets.filter(ticket => ticket.storyPoint === point.label).length) {
            this.toast.warning('Warning: some tickets are not visible in the current board!');
        }

        point.isVisible = false;
    }

    showStoryPoint(point: StoryPoint): void {
        point.isVisible = true;
    }

    moveTicketsLeft(point: StoryPoint): void {
        const ticketsToMove: Ticket[] = this.tickets.filter(ticket => ticket.storyPoint === point.label);
        const currentStoryPointIndex: number = this.storyPoints.findIndex(p => p === point);
        const desiredStoryPointIndex: number = currentStoryPointIndex ? currentStoryPointIndex - 1 : this.storyPoints.length - 1;

        if (ticketsToMove.length && !this.storyPoints[desiredStoryPointIndex].isVisible) {
            this.toast.warning('Warning: some tickets are not visible in the current board!');
        }

        ticketsToMove.forEach(ticket => ticket.storyPoint = this.storyPoints[desiredStoryPointIndex].label);
    }

    moveTicketsRight(point: StoryPoint): void {
        const ticketsToMove: Ticket[] = this.tickets.filter(ticket => ticket.storyPoint === point.label);
        const currentStoryPointIndex: number = this.storyPoints.findIndex(p => p === point);
        const desiredStoryPointIndex: number = (currentStoryPointIndex === this.storyPoints.length - 1) ? 0 : currentStoryPointIndex + 1;

        if (ticketsToMove.length && !this.storyPoints[desiredStoryPointIndex].isVisible) {
            this.toast.warning('Warning: some tickets are not visible in the current board!');
        }

        ticketsToMove.forEach(ticket => ticket.storyPoint = this.storyPoints[desiredStoryPointIndex].label);
    }

    isColumnEmpty(point: StoryPoint): boolean {
        return !this.tickets.filter(ticket => ticket.storyPoint === point.label).length;
    }

    isShowTicketFabVisible(): boolean {
        return !!this.selectedTicket;
    }

    isResetFabVisible(): boolean {
        return this.activeTab === Tab.EstimateTicket && !!this.cards.length;
    }

    isHiddenPointsFabVisible(): boolean {
        const hasHiddenStoryPoint = !!this.storyPoints
            .filter(point => !point.isVisible)
            .length;

        return this.activeTab === Tab.EstimatedTickets && hasHiddenStoryPoint
    }

    isRemoveCardFabVisible(): boolean {
        return !!this.cards
            .filter(card => card.isSelected)
            .length;
    }

    isExportStoryPointsFabVisible(): boolean {
        return this.tickets.filter(ticket => ticket.storyPoint).length && this.activeTab === Tab.EstimatedTickets;
    }

    openCreateNewTicket(event): void {
        this.$mdDialog.show({
            template: require('./modaldialogs/newticket/newticket.html'),
            controller: ['$scope', '$mdDialog', NewTicketController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#tickets-menu-button',
            closeTo: '#tickets-menu-button',
            clickOutsideToClose: true
        })
        .then((ticket: Ticket) => {
            this.tickets.push(ticket);
        })
        .catch(() => {});
    }

    openImportTicketsDialog(event): void {
        this.$mdDialog.show({
            template: require('./modaldialogs/importtickets/importtickets.html'),
            controller: ['$scope', '$http', '$mdDialog', ImportTicketsController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#tickets-menu-button',
            closeTo: '#tickets-menu-button',
            clickOutsideToClose: true
        })
        .then((tickets: Ticket[]) => {
            if (tickets && tickets.length) {
                tickets.forEach(ticket => ticket.isSelected = false);

                this.tickets.push(...tickets);
            }
        })
        .catch(() => {});
    }

    openShowTicketDialog(event): void {
        this.$mdDialog.show({
            template: require('./modaldialogs/showticket/showticket.html'),
            controller: <any>['$scope', '$mdDialog', 'ticket', ShowTicketController],
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

    openSetStoryPointDialog(event): void {
        this.$mdDialog.show({
            template: require('./modaldialogs/setstorypoint/setstorypoint.html'),
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

    exportStoryPoints(): void {
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

    reset(): void {
        this.socket.emit('RESET', null, () => {
            this.cards.forEach(card => card.value = null);
        });
    }

    toggleTicketSelection(ticket: Ticket): void {
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

    toggleCardSelection(cardToToggle: Card): void {
        cardToToggle.isSelected = !cardToToggle.isSelected;

        this.cards
            .filter(card => card !== cardToToggle)
            .forEach(card => card.isSelected = false);
    }

    removeSelectedCard(): void {
        const card = _.find(this.cards, card => card.isSelected);

        if (card) {
            this.socket.emit('REMOVE_USER', card, () => {
                _.pull(this.cards, card);
            });
        }
    }

    findCardById(id: string): Card {
        return _.find(this.cards, card => card.id === id);
    }

    getStoryPoints(): StoryPoint[] {
        return this.store.get('settings')
            .values
            .filter(setting => setting.checked && angular.isNumber(setting.label))
            .map(value => ({
                label: value.label,
                isVisible: true
            }));
    }
}
