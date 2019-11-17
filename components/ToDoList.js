import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

const {width} = Dimensions.get('window');

export default class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      toDoValue: props.text,
    };
    this.year = moment().format('YYYY');
    this.date = moment().format('D');
    this.month = moment().format('M');
    this.hour = moment().format('kk');
    this.minute = moment().format('mm');
    this.second = moment().format('ss');
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    completeToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired,
  };

  render() {
    const {isEditing, toDoValue} = this.state;
    const {text, id, deleteToDo, isCompleted} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle,
              ]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[
                styles.text,
                styles.input,
                isCompleted ? styles.completedText : styles.uncompletedText,
              ]}
              value={toDoValue}
              multiline={true}
              onChangeText={this._controllInput}
              returnKeyType={'done'}
              onBlur={this._finishEditing}
            />
          ) : (
            <View>
              <Text
                style={[
                  styles.text,
                  isCompleted ? styles.completedText : styles.uncompletedText,
                ]}>
                {text}
              </Text>
              <Text style={styles.day}>
                {this.hour}:{this.minute}:{this.second} {this.date}.{this.month}
                .{this.year}
              </Text>
            </View>
          )}
        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}> ✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={event => {
                event.stopPropagation;
                deleteToDo(id);
              }}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  _toggleComplete = event => {
    event.stopPropagation();
    const {isCompleted, uncompleteToDo, completeToDo, id} = this.props;
    if (isCompleted) {
      uncompleteToDo(id);
    } else {
      completeToDo(id);
    }
  };

  _startEditing = event => {
    event.stopPropagation();
    const {text} = this.props;
    this.setState({
      isEditing: true,
    });
  };

  _finishEditing = event => {
    event.stopPropagation();
    const {toDoValue} = this.state;
    const {id, updateToDo} = this.props;
    updateToDo(id, toDoValue);
    this.setState({
      isEditing: false,
    });
  };

  _controllInput = text => {
    this.setState({
      toDoValue: text,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
  },
  completedCircle: {
    borderColor: '#fcbb02',
  },
  uncompletedCircle: {
    borderColor: '#5d3067',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },
  completedText: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  uncompletedText: {
    color: '#5d3067',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5,
  },
  day: {
    color: '#bbb',
    fontSize: 10,
    fontWeight: '400',
    paddingBottom: 5,
  },
  dayoff: {
    color: '#5d3067',
    fontSize: 10,
    fontWeight: '400',
    paddingBottom: 5,
  },
});
