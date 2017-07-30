import * as _ from 'lodash';
import { Ticket } from 'app/models';

export function ShowTicketController($scope: ng.IScope, $mdDialog: ng.material.IDialogService, ticket: Ticket) {
    $scope.ticket = ticket;

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.close = () => {
        $mdDialog.cancel();
    };
}
