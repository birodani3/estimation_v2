export default function NewTicketController($scope, $mdDialog) {
    $scope.ticket = { storyPoint: null };

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