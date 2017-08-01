import { IStoreService } from 'app/services';

export function SettingsController($scope, $mdDialog: ng.material.IDialogService, store: IStoreService) {
    $scope.values = store.get('settings.values');

    $scope.close = () => {
        const settings = {
            values: $scope.values
        };

        $mdDialog.hide(settings);
    };

    $scope.isAllValuesChecked = () => {
        return $scope.values.every(value => value.checked);
    };

    $scope.isSomeValuesChecked = () => {
        return $scope.isAllValuesChecked()
            ? false
            : $scope.values.some(value => value.checked);
    };

    $scope.toggleAllValues = () => {
        const checked = !$scope.isAllValuesChecked();

        $scope.values.forEach(value => value.checked = checked);
    };
}