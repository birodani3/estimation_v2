/*@ngInject*/
export default class ResultController {
    constructor($scope, socket) {
        this.$scope = $scope;
        this.socket = socket;

        this.users = [];
        this.tickets = [{
            name: "Ticket name",
            description: "Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás Hosszú leírás "
        }];

        this.tickets = this.tickets.concat(this.tickets).concat(this.tickets)

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
}
