import NewTicketController from "./modaldialogs/newticket/newticket.controller.js";
import ImportTicketsController from "./modaldialogs/importtickets/importtickets.controller.js";
import newTicketTemplate from "./modaldialogs/newticket/newticket.html";
import importTicketsTemplate from "./modaldialogs/importtickets/importtickets.html";

/*@ngInject*/
export default class ResultController {
    constructor($scope, socket, $mdDialog) {
        this.$scope = $scope;
        this.socket = socket;
        this.$mdDialog = $mdDialog;

        this.users = [];
        this.tickets = [{
            title: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }];

        this.tickets = this.tickets.concat(this.tickets);

        this.initSocket();
    }

    initSocket() {
        this.socket.on("USER_JOINED", this.$scope, this.onUserJoined.bind(this));
        this.socket.on("USER_LEFT", this.$scope, this.onUserLeft.bind(this));
    }

    onUserJoined(user) {
        this.users.push(user);
    }

    onUserLeft(user) {
        _.remove(this.users, u => u.id === user.id);
    }

    openMenu($mdMenu, event) {
        $mdMenu.open(event);
    };

    openCreateNewTicket(event) {
        this.$mdDialog.show({
            template: newTicketTemplate,
            controller: ["$scope", "$mdDialog", NewTicketController],
            parent: angular.element(document.body),
            targetEvent: event,
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
            clickOutsideToClose: true
        })
        .then((data) => {
            console.log("data: ", data);
        })
        .catch(() => {
            // Dialog cancelled
        });
    }
}
