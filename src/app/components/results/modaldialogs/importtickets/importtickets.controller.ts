import { Ticket } from 'app/models';

export function ImportTicketsController($scope, $http: ng.IHttpService, $mdDialog: ng.material.IDialogService) {
    const jiraUrl = 'https://jira.cas.de';
    const storyPointField = 'customfield_10004';

    $scope.tickets = [];
    $scope.isSettingsShown = false;
    $scope.isTicketListMode = false;
    $scope.isLoading = false;
    $scope.jira = {
        projectId: 17200
    };
    $scope.filter = {
        issuetype: {
            story: true,
            task: true,
            bug: true,
            epic: false,
        }
    };

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.isAllTicketsChecked = () => {
        return $scope.tickets
            .filter($scope.ticketFilter)
            .every(ticket => ticket.isSelected);
    };

    $scope.isSomeTicketsChecked = () => {
        return $scope.isAllTicketsChecked()
            ? false
            : $scope.tickets
                .filter($scope.ticketFilter)
                .some(ticket => ticket.isSelected);
    };

    $scope.toggleTickets = () => {
        const isChecked = !$scope.isAllTicketsChecked();

        $scope.tickets
            .filter($scope.ticketFilter)
            .forEach(ticket => ticket.isSelected = isChecked);
    };

    $scope.ticketFilter = (ticket) => {
        return $scope.filter.issuetype[ticket.type.toLowerCase()];
    }

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
                            boardId: ticket.fields.sprint ? ticket.fields.sprint.originBoardId : null,
                            asignee: ticket.fields.assignee ? ticket.fields.assignee.displayName : 'none',
                            type: ticket.fields.issuetype.name,
                            //status: ticket.fields.status.name,
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
        const selectedTickets = $scope.tickets
            .filter($scope.ticketFilter)            
            .filter(ticket => ticket.isSelected);

        $mdDialog.hide(selectedTickets);
    }
}