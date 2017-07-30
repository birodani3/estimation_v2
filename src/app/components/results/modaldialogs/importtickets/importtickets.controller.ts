import { Ticket } from 'app/models';

export function ImportTicketsController($scope: ng.IScope, $http: ng.IHttpService, $mdDialog: ng.material.IDialogService) {
    const jiraUrl = 'https://jira.cas.de';
    const storyPointField = 'customfield_10004';
    let tickets: Ticket[] = [];

    $scope.isTicketListMode = false;
    $scope.isLoading = false;
    $scope.jira = {
        sprintId: 22412
    };

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.login = (credentials) => {
        const config = {
            method: 'POST',
            url: '/jira',
            data: credentials
        };

        $scope.isLoading = true;

        $http(config)
            .then((response: any) => {
                if (response.data) {
                    let rawTickets = response.data.issues || [];

                    $scope.isTicketListMode = true;

                    $scope.tickets = rawTickets
                        .filter(ticket => ticket.fields[storyPointField] === null)
                        .map(ticket => ({
                            title: ticket.fields.summary,
                            description: ticket.fields.description,
                            issueId: ticket.id,
                            boardId: ticket.fields.sprint.originBoardId,
                            isSelected: true,
                            storyPoint: null
                        }));
                }
            })
            .catch((err) => {
                $scope.tickets = [];
            })
            .finally(() => {
                $scope.isLoading = false;
            });
    }

    $scope.importTickets = () => {
        let selectedTickets = $scope.tickets.filter(ticket => ticket.isSelected);

        $mdDialog.hide(selectedTickets);
    }
}