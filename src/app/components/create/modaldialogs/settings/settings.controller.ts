import { IStoreService } from 'app/services';
import { ValueType } from '../../../../models';

export function SettingsController($scope, $mdDialog: ng.material.IDialogService, store: IStoreService) {
    $scope.values = store.get('settings.values');
    $scope.ValueType = ValueType;
    $scope.numberValues = $scope.values.filter(value => value.type === ValueType.Number);
    $scope.generalValues = $scope.values.filter(value => value.type === ValueType.General);
    $scope.tshirtValues = $scope.values.filter(value => value.type === ValueType.TShirt);

    $scope.close = () => {
        const settings = {
            values: $scope.values
        };

        $mdDialog.hide(settings);
    };

    $scope.isAllValuesChecked = (type: ValueType) => {
        return $scope.values
            .filter(value => value.type === type)
            .every(value => value.checked);
    };

    $scope.isSomeValuesChecked = (type: ValueType) => {
        return $scope.isAllValuesChecked(type)
            ? false
            : $scope.values
                .filter(value => value.type === type)
                .some(value => value.checked);
    };

    $scope.toggleValues = (type: ValueType) => {
        const checked = !$scope.isAllValuesChecked(type);

        $scope.values
            .filter(value => value.type === type)
            .forEach(value => value.checked = checked);
    };
}