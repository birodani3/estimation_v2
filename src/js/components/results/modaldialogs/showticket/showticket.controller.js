import _ from 'lodash';

export default function ShowTicketController($scope, $mdDialog, ticket) {
    $scope.ticket = ticket;

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.close = () => {
        $mdDialog.cancel();
    };
}