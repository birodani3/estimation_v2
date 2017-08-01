import * as angular from 'angular';
import * as _ from 'lodash';
import { IStoreService } from 'app/services';
import { Card, Ticket } from 'app/models';

interface Suggestion {
    value: number;
    count: number;
}

export function SetStoryPointController(
    $scope,
    $http: ng.IHttpService,
    $mdDialog: ng.material.IDialogService,
    store: IStoreService,
    ticket: Ticket,
    cards: Card[]
) {
    const jiraUrl = 'https://jira.cas.de';

    $scope.ticketName = ticket.title;
    $scope.storyPoints = store.get('settings.values').filter(value => {
        return value.checked && angular.isNumber(value.label)
    });

    $scope.suggestedStoryPoint = getSuggestion();
    
    if (angular.isNumber($scope.suggestedStoryPoint)) {
        $scope.storyPoint = $scope.suggestedStoryPoint;

        const storyPointToSelect = _.find<any>($scope.storyPoints, { label: $scope.suggestedStoryPoint });

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

    function getSuggestion(): number {
        if (!cards.length) {
            return null;
        }

        const groups: Suggestion[] = _(cards)
            .groupBy('value')
            .map((cards, value) => ({
                count: cards.length,
                value: +value
            }))
            .value();

        // Maximum number of cards with the same value
        const maxCount = Math.max(...groups.map(group => group.count));
        // Value(s) with maxCount
        const suggestions: Suggestion[] = groups.filter(group => group.count === maxCount);

        if (suggestions.length === 0) {
            return null;
        } else if (suggestions.length === 1) {
            return suggestions.pop().value;
        } else {
            // Suggestion is the closest one to the average
            const sumStoryPoints: number = cards.reduce<any>((acc, curr) => acc + curr.value, 0);
            const average = sumStoryPoints / cards.length;

            return suggestions
                .sort((a, b) => Math.abs(average - a.count) + Math.abs(average - b.count))
                .pop()
                .value;
        }
    }
}