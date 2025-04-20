import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

// Define the Task type
type Task = {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
  priority?: "Low" | "Medium" | "High";
};

export default function TodoList() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const modalOpacity = useState(new Animated.Value(0))[0];
  const router = useRouter();

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([
      ...tasks,
      { id: Date.now().toString(), text: task, done: false, dueDate, priority },
    ]);
    setTask("");
    setDueDate("");
    setPriority("Medium");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const confirmDeleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask(id) },
    ]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate || "");
    setEditPriority(task.priority || "Medium");
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const saveEditTask = () => {
    if (!editingTaskId) return;
    setTasks((prev) =>
      prev.map((item) =>
        item.id === editingTaskId
          ? { ...item, text: editText, dueDate: editDueDate, priority: editPriority }
          : item
      )
    );
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setEditingTaskId(null);
      setEditText("");
      setEditDueDate("");
      setEditPriority("Medium");
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={styles.header}>📝 To-Do Checklist</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Add a task"
          style={styles.input}
        />
        <TextInput
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="Due date (e.g. 2024-05-01)"
          style={styles.input}
        />
        <Text style={{ marginTop: 10, marginBottom: 5 }}>Priority</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Low Priority" value="Low" />
          <Picker.Item label="Medium Priority" value="Medium" />
          <Picker.Item label="High Priority" value="High" />
        </Picker>
        <View style={{ marginTop: 10 }}>
          <Pressable onPress={addTask} style={styles.addButton}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <Pressable
                onPress={() => confirmDeleteTask(item.id)}
                style={{ backgroundColor: "red", justifyContent: "center", padding: 20 }}
              >
                <Text style={{ color: "white" }}>Delete</Text>
              </Pressable>
            )}
          >
            <View style={[styles.taskItem, item.done && styles.taskDone]}>
              <Pressable
                onPress={() => toggleTask(item.id)}
                onLongPress={() => startEditTask(item)}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    color: item.done ? "gray" : "black",
                    textDecorationLine: item.done ? "line-through" : "none",
                  }}
                >
                  {item.text} ({item.priority}) {item.dueDate ? `- Due: ${item.dueDate}` : ""}
                </Text>
              </Pressable>
            </View>
          </Swipeable>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", color: "gray" }}>No tasks yet</Text>}
      />

      {/* Edit Modal */}
      {editingTaskId && (
        <Modal transparent animationType="none">
          <Animated.View style={[styles.modalContainer, { opacity: modalOpacity }]}>
            <View style={styles.modalContent}>
              <Text style={{ marginBottom: 10 }}>Edit Task</Text>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                style={styles.input}
                placeholder="Edit task..."
              />
              <TextInput
                value={editDueDate}
                onChangeText={setEditDueDate}
                style={styles.input}
                placeholder="Edit due date"
              />
              <Text style={{ marginTop: 10, marginBottom: 5 }}>Edit Priority</Text>
              <Picker
                selectedValue={editPriority}
                onValueChange={(itemValue) => setEditPriority(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Low Priority" value="Low" />
                <Picker.Item label="Medium Priority" value="Medium" />
                <Picker.Item label="High Priority" value="High" />
              </Picker>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <Pressable onPress={closeModal}>
                  <Text style={{ color: "gray" }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={saveEditTask}>
                  <Text style={{ color: "blue" }}>Save</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskDone: {
    backgroundColor: "#e0e0e0",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});