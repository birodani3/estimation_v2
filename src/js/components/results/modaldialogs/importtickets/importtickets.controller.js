export default function ImportTicketsController($scope, $http, $mdDialog) {
    const jiraUrl = "https://jira.cas.de";
    let tickets = [];
    $scope.jira = {
        // TODO get rid of this :D
        sprintId: 22412
    }

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.login = (credentials) => {
        const config = {
            method: "POST",
            url: "/jira",
            data: credentials
        };

        $http(config)
            .then((response) => {
                if (response.data) {
                    let rawTickets = response.data.issues || [];

                    let tickets = rawTickets
                        .filter(ticket => ticket.fields.customfield_10004 === null)
                        .map(ticket => ({
                            title: ticket.fields.summary,
                            description: ticket.fields.description,
                            storyPoint: null
                        }));

                    $mdDialog.hide(tickets);
                }
            })
            .catch((err) => {
                $mdDialog.hide();
            });
    }
}