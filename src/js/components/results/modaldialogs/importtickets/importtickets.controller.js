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

    $scope.getJiraSessionCookie = (credentials) => {
        $http({
            method: "GET",
            url: `${jiraUrl}/rest/agile/1.0/board`,
            data: credentials,
            dataType: "JSON",
            contentType: "application/json;",
            headers: {
                contentType: "application/json",
            }
        })
        .then(data => {
            console.log("data: ", data);
        }).catch(err => {
            console.log("err: ", err);
        })
    }
}