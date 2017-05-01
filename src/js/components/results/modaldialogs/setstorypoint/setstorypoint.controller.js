export default function SetStoryPointController($scope, $http, $mdDialog, store) {
    const jiraUrl = "https://jira.cas.de";
    //$scope.ticketName = ticketName;
    $scope.storyPoints = store.get("settings").values;
    $scope.suggestedStoryPoint = 3;

    if ($scope.suggestedStoryPoint) {
        $scope.storyPoint = $scope.suggestedStoryPoint;
    }

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.set = () => {
        $mdDialog.hide($scope.storyPoint);
    }
}