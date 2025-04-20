import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

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
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );
  const modalOpacity = useState(new Animated.Value(0))[0];
  const router = useRouter();

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: task,
        done: false,
        dueDate,
        priority,
      },
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

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
          ? {
              ...item,
              text: editText,
              dueDate: editDueDate,
              priority: editPriority,
            }
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

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.done) - Number(b.done)
  );

  const renderTasks = (done: boolean) =>
    sortedTasks
      .filter((item) => item.done === done)
      .map((item) => (
        <View
          key={item.id}
          style={[styles.taskItem, item.done && styles.taskDone]}
        >
          <Pressable
            onPress={() => toggleTask(item.id)}
            onLongPress={() => startEditTask(item)}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                color: item.done
                  ? "gray"
                  : item.priority === "High"
                  ? "#d32f2f"
                  : item.priority === "Medium"
                  ? "#fbc02d"
                  : "#388e3c",
                textDecorationLine: item.done ? "line-through" : "none",
                fontFamily: "System",
              }}
            >
              {item.priority === "High"
                ? "🔥 "
                : item.priority === "Medium"
                ? "⚠️ "
                : "✅ "}
              {item.text} {item.dueDate ? `- Due: ${item.dueDate}` : ""}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => deleteTask(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>🗑</Text>
          </Pressable>
        </View>
      ));

  return (
    <View style={styles.container}>
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
        <Text style={styles.label}>Priority</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Low Priority" value="Low" />
          <Picker.Item label="Medium Priority" value="Medium" />
          <Picker.Item label="High Priority" value="High" />
        </Picker>
        <Pressable onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {tasks.some((t) => !t.done) && (
          <Text style={styles.groupHeader}>📌 Incomplete Tasks</Text>
        )}
        {renderTasks(false)}

        {tasks.some((t) => t.done) && (
          <Text style={styles.groupHeader}>✅ Completed Tasks</Text>
        )}
        {renderTasks(true)}

        {tasks.length === 0 && (
          <Text style={{ textAlign: "center", color: "gray" }}>
            No tasks yet
          </Text>
        )}
      </ScrollView>

      {editingTaskId && (
        <Modal transparent animationType="none">
          <Animated.View
            style={[styles.modalContainer, { opacity: modalOpacity }]}
          >
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
              <Text style={styles.label}>Edit Priority</Text>
              <Picker
                selectedValue={editPriority}
                onValueChange={(itemValue) => setEditPriority(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Low Priority" value="Low" />
                <Picker.Item label="Medium Priority" value="Medium" />
                <Picker.Item label="High Priority" value="High" />
              </Picker>
              <View style={styles.modalButtons}>
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
    fontFamily: "System",
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
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
    fontFamily: "System",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
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
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
