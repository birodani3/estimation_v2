export default function SettingsController($scope, $mdDialog, store) {
    $scope.values = store.get("settings").values;

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