export default function NewTicketController($scope, $mdDialog) {
    $scope.ticket = {};

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.save = (ticket) => {
        $mdDialog.hide(ticket);
    };
}