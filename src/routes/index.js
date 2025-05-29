import SettingLayout from '~/components/Layout/Admin/SettingLayout';
import Users from '~/pages/Admin/Users';
import Stories from '~/pages/Admin/Stories';
import AdminSetting from '~/pages/Admin/AdminSetting';
import EditUsers from '~/pages/Admin/EditUsers';
import Categories from '~/pages/Admin/Categories';
import EditCategory from '~/pages/Admin/EditCategory';
import Support from '~/pages/Admin/Support';
import EditStory from '~/pages/Admin/EditStory';
import Storychapter from '~/pages/Admin/Storychapter';
import Storydetail from '~/pages/Admin/Storydetail';
import EditChapter from '~/pages/Admin/EditChapter';
import DefaultLayout from '~/components/Layout/Client/DefaultLayout';
import AdminDefaultLayout from '~/components/Layout/Admin/AdminDefaultLayout';
import AdminHome from '~/pages/Admin/AdminHome';
import Home from '~/pages/Client/Home';
import Completed from '~/pages/Client/Completed';
import AllList from '~/pages/Client/Alllist';
import Bookmark from '~/pages/Client/Bookmark';
import Search from '~/pages/Client/Search';
import Chapter from '~/pages/Client/Chapter';
import Genre from '~/pages/Client/Genre';
import History from '~/pages/Client/History';
import Latest from '~/pages/Client/Latest';
import Series from '~/pages/Client/Series';
import Setting from '~/pages/Client/Setting';
import Supportdetail from '~/pages/Admin/Supportdetail';
import NotFoundPages from '~/components/Notfound/notFoundPages';
import GlobalStylesAdmin from '~/components/GlobalStyles/admin/GlobalStylesAdmin';
import GlobalStylesClient from '~/components/GlobalStyles/client/GlobalStylesClient';

//public route
const publicRoutes = [
    { path: '/home', component: AdminHome, layout: AdminDefaultLayout, globle: GlobalStylesAdmin, role: 'admin' },
    {
        path: '/adminsetting',
        component: AdminSetting,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    { path: '/stories', component: Stories, layout: AdminDefaultLayout, globle: GlobalStylesAdmin, role: 'admin' },
    { path: '/users', component: Users, layout: AdminDefaultLayout, globle: GlobalStylesAdmin, role: 'admin' },
    { path: '/edit-users', component: EditUsers, layout: AdminDefaultLayout, globle: GlobalStylesAdmin, role: 'admin' },
    {
        path: '/categories',
        component: Categories,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    {
        path: '/edit-category',
        component: EditCategory,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    { path: '/support', component: Support, layout: AdminDefaultLayout, globle: GlobalStylesAdmin, role: 'admin' },
    {
        path: '/supportdetail',
        component: Supportdetail,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    {
        path: '/edit-stories',
        component: EditStory,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    {
        path: '/storychapter',
        component: Storychapter,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    {
        path: '/storydetail',
        component: Storydetail,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },
    {
        path: '/edit-chapter',
        component: EditChapter,
        layout: AdminDefaultLayout,
        globle: GlobalStylesAdmin,
        role: 'admin',
    },

    { path: '/', component: Home, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/completed/:pages', component: Completed, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/latest/:pages', component: Latest, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/series-list/:pages', component: AllList, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/genre/:genre/:pages', component: Genre, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/search/:search/:pages', component: Search, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/series/:id', component: Series, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/chapter/:chapterid/:id', component: Chapter, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/bookmark', component: Bookmark, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/history', component: History, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '/setting', component: Setting, layout: DefaultLayout, globle: GlobalStylesClient },
    { path: '*', component: NotFoundPages, layout: DefaultLayout, globle: GlobalStylesClient },
];
//private route
const privateRoutes = [];

export { publicRoutes, privateRoutes };
