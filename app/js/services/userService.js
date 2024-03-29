four51.app.factory('User', function($q, $rootScope, $resource, $451, Security, Error) {
    var _cacheName = '451Cache.User.' + $451.apiName;
	function _then(fn, data) {
        if (angular.isFunction(fn))
            fn(data);
    }

    function _extend(u) {
		u.Permissions.contains = function(value) {
            return $451.contains(u.Permissions, value);
        };
        if ($451.contains(u.Permissions, ['PayByVisa', 'PayByMasterCard', 'PayByAmex', 'PayByDiscover', 'PayByDinersClub', 'PayByJCB', 'PayByDelta', 'PayBySwitch', 'PayBySolo', 'PayByElectron', 'PayByLaser']))
            u.Permissions.push('PayByCreditCard');

	    angular.forEach(u.CustomFields, function(f) {
			if (f.ControlType == 'File' && f.File && f.File.Url.indexOf('auth') == -1)
				f.File.Url += "&auth=" + Security.auth();
	    });
	    u.Company.POIDMask = u.Company.POIDMask.toUpperCase();
    }

	var _refresh = function() {
		store.remove(_cacheName);
		_get();
	}

    var _get = function(success) {
        var user = store.get(_cacheName);
	    user ? (function() { _extend(user); _then(success,user); })() :
            $resource($451.api('user')).get().$promise.then(function(u) {
                _extend(u);
                _then(success,u);
                store.set(_cacheName, u);
            });
    }

    var _save = function(user, success, error) {
        $resource($451.api('user')).save(user).$promise.then(
	        function(u) {
                _extend(u);
                _then(success,u);
                store.set(_cacheName, u);
            },
	        function(ex) {
		        error(Error.format(ex));
	        }
        );
    }

    var _login = function(credentials,success) {
	    store.clear();
        $resource($451.api('login')).get(credentials).$promise.then(function(u) {
            _then(success,u);
        });
    }

    var _logout = function() {
        store.clear();
        Security.logout();
    }

    return {
        get: _get,
        login: _login,
        save: _save,
        logout: _logout,
	    refresh: _refresh
    }
});