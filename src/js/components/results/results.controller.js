import NewTicketController from "./modaldialogs/newticket/newticket.controller.js";
import ImportTicketsController from "./modaldialogs/importtickets/importtickets.controller.js";
import newTicketTemplate from "./modaldialogs/newticket/newticket.html";
import importTicketsTemplate from "./modaldialogs/importtickets/importtickets.html";
import _ from "lodash";

/*@ngInject*/
export default class ResultController {
    constructor($scope, socket, hover, $mdDialog, dragulaBagId, dragulaService) {
        this.$scope = $scope;
        this.socket = socket;
        this.$mdDialog = $mdDialog;

        // TODO options
        this.storyPoints = [1,2,3,5,8,13,20,40];

        //dragulaService
        /*hover.bag(dragulaBagId, $scope)
            .on("drop", (e, el) => {
                console.log("drop!", e, el);
            })
            .use();*/

        this.cards = [];
        this.tickets = [{
            title: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }, {
            title: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }];

        this.initSocket();
    }

    initSocket() {
        this.socket.on("USER_JOINED", this.$scope, this.onUserJoined.bind(this));
        this.socket.on("USER_LEFT", this.$scope, this.onUserLeft.bind(this));
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

    openMenu($mdMenu, event) {
        $mdMenu.open(event);
    };

    hideStoryPoint(point) {
        _.pull(this.storyPoints, point);
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
        })
        .catch(() => {
            // Dialog cancelled
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
        })
        .catch(() => {
            // Dialog cancelled
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

    selectCard(card) {
        card.isSelected = true;
    }
}
