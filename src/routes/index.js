import Home from '~/pages/Client/Home';
import Login from '~/pages/Client/Login';
import Settings from '~/pages/Client/Setting';
import SettingLayout from '~/components/Layout/Admin/SettingLayout';
import Users from '~/pages/Admin/Users';
import Stories from '~/pages/Admin/Stories';
import AdminSupport from '~/pages/Admin/AdminSupport';
import AdminSetting from '~/pages/Admin/AdminSetting';
import EditUsers from '~/pages/Admin/EditUsers';
//public route
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/adminsetting', component: AdminSetting },
    { path: '/setting', component: Settings, layout: SettingLayout },
    { path: '/stories', component: Stories },
    { path: '/users', component: Users },
    { path: '/adminsupport', component: AdminSupport },
    { path: '/edit-users', component: EditUsers },
];
//private route
const privateRoutes = [];

export { publicRoutes, privateRoutes };
