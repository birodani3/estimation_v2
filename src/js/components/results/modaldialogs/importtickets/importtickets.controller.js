export default function ImportTicketsController($scope, $http, $mdDialog) {
    const jiraUrl = "https://jira.cas.de";
    let tickets = [];

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.save = () => {
        $mdDialog.hide(tickets);
    };

    $scope.login = (credentials) => {
        const config = {
            method: "POST",
            url: "/jira",
            data: credentials
        }

        $http(config)
            .then((a) => {
                console.log("then: ", a);
            })
            .catch((c) => {
                console.log("cat: ", c);
            });
    }
}