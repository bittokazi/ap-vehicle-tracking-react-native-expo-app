import {createStackNavigator, createAppContainer} from 'react-navigation';
import { zoomIn } from 'react-navigation-transitions';
import Login from './Login';
import Dashboard from './Dashboard';
import AddUser from './user/AddUser';
import ShowUsers from './user/ShowUsers';
import AddCounter from './counter/AddCounter';
import ShowCounters from './counter/ShowCounters';
import AddVehicle from './vehicle/AddVehicle';
import ShowVehicles from './vehicle/ShowVehicles';
import AddTask from './task/AddTask';
import ShowTasks from './task/ShowTasks';
import ShowTask from './task/ShowTask';

const MainNavigator = createStackNavigator(
  {
    Login: {
      screen: Login, 
      navigationOptions: {
        header: null,
      }
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        header: null,
      }
    },
    AddUser: {
      screen: AddUser,
      navigationOptions: {
        header: null,
      }
    },
    ShowUsers: {
      screen: ShowUsers,
      navigationOptions: {
        header: null,
      }
    },
    AddCounter: {
      screen: AddCounter,
      navigationOptions: {
        header: null,
      }
    },
    ShowCounters: {
      screen: ShowCounters,
      navigationOptions: {
        header: null,
      }
    },
    AddVehicle: {
      screen: AddVehicle,
      navigationOptions: {
        header: null,
      }
    },
    ShowVehicles: {
      screen: ShowVehicles,
      navigationOptions: {
        header: null,
      }
    },
    AddTask: {
      screen: AddTask,
      navigationOptions: {
        header: null,
      }
    },
    ShowTasks: {
      screen: ShowTasks,
      navigationOptions: {
        header: null,
      }
    },
    ShowTask: {
      screen: ShowTask,
      navigationOptions: {
        header: null,
      }
    },
  },
  {
    initialRouteName: 'Login',
    transitionConfig: () => zoomIn(),
  }
);
const App = createAppContainer(MainNavigator);

export default App;