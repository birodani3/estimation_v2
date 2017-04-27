import NewTicketController from "./modaldialogs/newticket/newticket.controller.js";
import ImportTicketsController from "./modaldialogs/importtickets/importtickets.controller.js";
import newTicketTemplate from "./modaldialogs/newticket/newticket.html";
import importTicketsTemplate from "./modaldialogs/importtickets/importtickets.html";
import _ from "lodash";

/*@ngInject*/
export default class ResultController {
    constructor($scope, socket, hover, $mdDialog, dragulaBagId, store) {
        this.$scope = $scope;
        this.socket = socket;
        this.store = store;
        this.$mdDialog = $mdDialog;

        this.Tabs = {
            "ESTIMATE_TICKET": 0,
            "ESTIMATED_TICKETS": 1
        };

        this.storyPoints = this.getStoryPoints();
        this.isFlipped = false;
        this.activeTab = this.Tabs.ESTIMATE_TICKET;

        hover.bag(dragulaBagId, $scope)
            .on("drop", (event, element, target, source) => {
                let droppedTicket = element.scope().ticket;
                let point = target.scope().point;
                let newStoryPoint = point ? point.label : null;

                droppedTicket.storyPoint = newStoryPoint;
            })
            .use();

        this.cards = [];
        this.tickets = [{
            title: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }, {
            title: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }];

        this.initSocket();
        this.initWatchers();
    }

    initSocket() {
        this.socket.on("USER_JOINED", this.$scope, this.onUserJoined.bind(this));
        this.socket.on("USER_LEFT", this.$scope, this.onUserLeft.bind(this));
        this.socket.on("USER_VOTED", this.$scope, this.onUserVoted.bind(this));
    }

    initWatchers() {
        this.$scope.$watch(() => this.cards, () => {
            this.isFlipped = this.cards.every(card => card.value !== null);
        }, true);
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

    openMenu($mdMenu, event) {
        $mdMenu.open(event);
    };

    hideStoryPoint(point) {
        point.isVisible = false;
    }

    showStoryPoint(point) {
        point.isVisible = true;
    }

    isResetFabVisible() {
        return this.activeTab === this.Tabs.ESTIMATE_TICKET && this.cards.length;
    }

    isHiddenPointsFabVisible() {
        const hasHiddenStoryPoint = this.storyPoints
            .filter(point => !point.isVisible)
            .length;

        return this.activeTab === this.Tabs.ESTIMATED_TICKETS && hasHiddenStoryPoint
    }

    isRemoveCardFabVisible() {
        return this.cards
            .filter(card => card.isSelected)
            .length;
    }

    openCreateNewTicket(event) {
        this.$mdDialog.show({
            template: newTicketTemplate,
            controller: ["$scope", "$mdDialog", NewTicketController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: "#tickets-menu-button",
            closeTo: "#tickets-menu-button",
            clickOutsideToClose: true
        })
        .then((ticket) => {
            this.tickets.push(ticket);
        });
    }

    openImportTicketsDialog(event) {
        this.$mdDialog.show({
            template: importTicketsTemplate,
            controller: ["$scope", "$http", "$mdDialog", ImportTicketsController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: "#tickets-menu-button",
            closeTo: "#tickets-menu-button",
            clickOutsideToClose: true
        })
        .then((data) => {
            console.log("data: ", data);
        });
    }

    reset() {
        this.cards.forEach(card => card.value = null);
        this.socket.emit("RESET");
    }

    toggleTicketSelection(ticket) {
        ticket.isSelected = !ticket.isSelected;

        if (ticket.isSelected) {
            this.reset();
        } else {

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

        this.socket.emit("REMOVE_USER", card);

        _.pull(this.cards, card);
    }

    findCardById(id) {
        return _.find(this.cards, card => card.id === id);
    }

    getStoryPoints() {
        return this.store.get("settings")
            .values
            .filter(setting => setting.checked)
            .map(value => ({
                label: value.label,
                isVisible: true
            }));
    }
}
