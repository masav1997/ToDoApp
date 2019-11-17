import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import TodoList from './components/ToDoList';
import uuidv1 from 'uuid/v1';

const {width} = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    newToDo: '',
    loadedToDos: false,
    toDos: {},
  };

  render() {
    const {newToDo, toDos} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Список дел</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={'Добавить новую задачу'}
            value={newToDo}
            onChangeText={this._controllNewToDo}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={'transparent'}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map(toDo => (
                <TodoList
                  key={toDo.id}
                  deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}
                  {...toDo}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controllNewToDo = text => {
    this.setState({
      newToDo: text,
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem('toDos');
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {},
      });
    } catch (err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const {newToDo} = this.state;
    if (newToDo !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now(),
          },
        };
        const newState = {
          ...prevState,
          newToDo: '',
          toDos: {
            ...prevState.toDos,
            ...newToDoObject,
          },
        };
        this._saveToDos(newState.toDos);
        return {...newState};
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos,
      };
      return {...newState};
    });
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem('toDos', JSON.stringify(newToDos));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    color: '#5d3067',
    fontSize: 36,
    marginTop: 60,
    fontWeight: '300',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff1d6',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: 'rgb(50, 50, 50)',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: -1,
      width: 0,
    }
  },
  input: {
    padding: 20,
    borderBottomColor: '#5d3067',
    borderBottomWidth: 1,
    fontSize: 24,
  },
  toDos: {
    alignItems: 'center',
  },
});
