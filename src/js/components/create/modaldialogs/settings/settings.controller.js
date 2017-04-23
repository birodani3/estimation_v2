export default function SettingsController($scope, $mdDialog) {
    $scope.values = [
        { label: 0,   checked: false },
        { label: "½", checked: false },
        { label: 1,   checked: true },
        { label: 2,   checked: true },
        { label: 3,   checked: true },
        { label: 5,   checked: true },
        { label: 8,   checked: true },
        { label: 13,  checked: true },
        { label: 20,  checked: true },
        { label: 40,  checked: true },
        { label: 100, checked: true },
        { label: "?", checked: true },
        { label: "∞", checked: true },
    ];

    $scope.close = () => {
        const settings = {
            values: $scope.values
        }

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