import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
    Table, Thead, Tbody, Tr, Th, Td, TableContainer, InputGroup, Input, InputRightElement,
    IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Box
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useToast, Spinner } from '@chakra-ui/react';
import style from "../Styles/Todo.module.css"

const Todo = () => {

    const [todos, setTodos] = useState([]);
    const [flag, setFlag] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    //add
    const [newTodo, setNewTodo] = useState({
        completed: false,
        title: "",
        userId: 1
    })

    //edit
    const [editTodo, setEditTodo] = useState({
        title: "",
        id: ""
    })

    //Chakra-UI
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

    //displayed tasks
    const allTasks = showCompleted
        ? todos.filter((ele) => ele.completed === true)
        : todos

    const handleAdd = () => {
        if (newTodo.title === "") {
            toast({
                title: 'Empty Task',
                description: "Cannot add empty task",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return
        }
        setTodos([...todos, newTodo]);
        setNewTodo({ ...newTodo, title: "" });
        toast({
            title: 'Task added',
            description: `"${newTodo.title}" added`,
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    const handleEdit = () => {
        let editedTodos = [];

        editedTodos = todos.map((ele) => {
            if (ele.id === editTodo.id) return { ...ele, title: editTodo.title }
            else return ele
        })
        setTodos(editedTodos)
        onClose()
    }

    const handleDelete = (id, title) => {
        const filteredTodo = todos.filter((ele) => {
            return ele.id !== id
        })
        setTodos(filteredTodo)
        toast({
            title: 'Task deleted',
            description: `"${title}" is deleted`,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    const handleStatusToggle = (id) => {
        let editedTodos = [];

        editedTodos = todos.map((ele) => {
            if (ele.id === id) return { ...ele, completed: !ele.completed }
            else return ele
        })

        setTodos(editedTodos)
    }

    const fetchTodos = () => {
        axios.get('https://jsonplaceholder.typicode.com/users/1/todos')
            .then((res) => {
                setTodos(res.data)
                setFlag(true)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchTodos();
    }, [])

    return (
        <div className={style.main}>
            <Box className={style.inputgroup}>
            <InputGroup>
                <Input type='text' placeholder='Enter Task' value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} />
                <InputRightElement>
                    <IconButton
                        aria-label='Search database'
                        variant='outline'
                        icon={<AddIcon />}
                        onClick={handleAdd}
                    />
                </InputRightElement>
            </InputGroup>
            </Box>

            <Button variant='outline' onClick={() => {
                setShowCompleted(!showCompleted)
            }}>
                {
                    showCompleted ? "Show All" : "Show Completed"
                }
            </Button>

            <TableContainer className={style.table}>
                <Table variant='simple'>
                    <Thead className={style.thead}>
                        <Tr>
                            <Th>Sl. No.</Th>
                            <Th>Task</Th>
                            <Th>Status</Th>
                            <Th></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            flag ? allTasks.map((ele, i) =>
                                <Tr key={i}>
                                    <Td>{i + 1}</Td>
                                    <Td className={style.title}>{ele.title}</Td>
                                    <Td className={ele.completed ? `${style.completed}` : `${style.notcompleted}`}
                                        onClick={() => handleStatusToggle(ele.id)}>
                                        {ele.completed ? "Completed" : "Not Complete"}
                                    </Td>
                                    <Td><EditIcon onClick={() => {
                                        onOpen()
                                        setEditTodo({ ...editTodo, title: ele.title, id: ele.id })
                                    }} /></Td>
                                    <Td><DeleteIcon onClick={() => handleDelete(ele.id, ele.title)} /></Td>
                                </Tr>
                            ) : <Spinner className={style.spinner} color='blue.500' size="xl"/>
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input placeholder='Edit task' value={editTodo.title}
                            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })} />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' colorScheme='red' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant='ghost' colorScheme='green' onClick={handleEdit}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Todo