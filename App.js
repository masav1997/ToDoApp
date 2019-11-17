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

export default class App extends React.Component {
  state = {
    newTodoItem: '',
  };

  saveTodos = newToDos => {
    AsyncStorage.setItem('todos', JSON.stringify(newToDos));
  };

  newTodoItemController = textValue => {
    this.setState({
      newTodoItem: textValue,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.appTitle}>Список дел</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Добавить новую задачу"
            value={this.newTodoItem}
            onChangeText={this.newTodoItemController}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.listContainer}>
            <TodoList textValue={'TodoItem'} />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#5d3067',
    fontSize: 36,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '300',
  },
  card: {
    backgroundColor: '#fff1d6',
    flex: 1,
    width: Dimensions.get('window').width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: 'rgb(50,50,50)',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: -1,
      width: 0,
    },
  },
  input: {
    padding: 20,
    borderBottomColor: '#5d3067',
    borderBottomWidth: 1,
    fontSize: 24,
  },
  listContainer: {
    alignItems: 'center',
  },
});
