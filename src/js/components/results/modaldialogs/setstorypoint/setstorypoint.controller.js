export default function SetStoryPointController($scope, $http, $mdDialog, store, ticket, cards) {
    const jiraUrl = "https://jira.cas.de";

    $scope.ticketName = ticket.title;
    $scope.storyPoints = store.get("settings")
        .values
        .filter(value => value.checked && angular.isNumber(value.label));

    $scope.suggestedStoryPoint = getSuggestion();
    
    if ($scope.suggestedStoryPoint) {
        $scope.storyPoint = $scope.suggestedStoryPoint;

        const storyPointToSelect = _.find($scope.storyPoints, { label: $scope.suggestedStoryPoint });

        if (storyPointToSelect) {
            storyPointToSelect.isSelected = true;
        }
    }

    $scope.selectStoryPoint = (storyPoint) => {
        storyPoint.isSelected = !storyPoint.isSelected;

        $scope.storyPoints
            .filter(sp => sp !== storyPoint)
            .forEach(sp => sp.isSelected = false);

        $scope.storyPoint = storyPoint.isSelected ? storyPoint.label : null;
    };

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.set = () => {
        $mdDialog.hide($scope.storyPoint);
    };

    function getSuggestion() {
        if (!cards.length) {
            return null;
        }

        const groups = _(cards)
            .groupBy("value")
            .map((cards, value) => ({
                count: cards.length,
                value: +value
            }))
            .value();

        // Maximum number of cards with the same value
        const maxCount = Math.max(...groups.map(group => group.count));
        // Value(s) with maxCount
        const suggestions = groups.filter(group => group.count === maxCount);

        if (suggestions.length === 1) {
            return suggestions.pop().value;
        } else {
            // Suggestion is the closest one to the average
            const sumStoryPoints = cards.reduce((acc, curr) => acc + curr.value, 0);
            const average = sumStoryPoints / cards.length;

            return suggestions
                .sort((a, b) => Math.abs(average - a.count) + Math.abs(average - b.count))
                .pop()
                .value;
        }
    }
}