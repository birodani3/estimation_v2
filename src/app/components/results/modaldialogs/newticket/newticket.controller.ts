export function NewTicketController($scope, $mdDialog: ng.material.IDialogService) {
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