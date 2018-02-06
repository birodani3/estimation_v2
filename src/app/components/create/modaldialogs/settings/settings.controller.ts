import { IStoreService } from 'app/services';

export function SettingsController($scope, $mdDialog: ng.material.IDialogService, store: IStoreService) {
    $scope.values = store.get('settings.values');
    $scope.numberValues = $scope.values.filter(value => value.type === 'number');
    $scope.generalValues = $scope.values.filter(value => value.type === 'general');
    $scope.tshirtValues = $scope.values.filter(value => value.type === 't-shirt');

    $scope.close = () => {
        const settings = {
            values: $scope.values
        };

        $mdDialog.hide(settings);
    };

    $scope.isAllValuesChecked = (type: string) => {
        return $scope.values
            .filter(value => value.type === type)
            .every(value => value.checked);
    };

    $scope.isSomeValuesChecked = (type: string) => {
        return $scope.isAllValuesChecked(type)
            ? false
            : $scope.values
                .filter(value => value.type === type)
                .some(value => value.checked);
    };

    $scope.toggleValues = (type: string) => {
        const checked = !$scope.isAllValuesChecked(type);

        $scope.values
            .filter(value => value.type === type)
            .forEach(value => value.checked = checked)
    };
}