import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [tareas, setTareas] = useState([]);
    const [editingTareaId, setEditingTareaId] = useState(null);
    const [title, setTitle] = useState('');
    const [completed, setCompleted] = useState(false);

    const URL = 'http://localhost:3001/tareas'; 

//mostrar tareas

    useEffect(() => {
        axios.get(URL)
            .then(response => {
                setTareas(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener las tareas:', error);
            });
    }, []);

//agregar tarea

    const handleAddTarea = (e) => {
        e.preventDefault();

        const newTarea = { title, completed: false };
        axios.post(URL, newTarea)
            .then(response => {
                setTareas([...tareas, response.data]);
                setTitle('');
                setCompleted(false);
            })
            .catch(error => {
                console.error('Hubo un error al agregar la tarea:', error);
            });
    };

//editar tareas

    const handleEditTarea = (tarea) => {
        setEditingTareaId(tarea.id);
        setTitle(tarea.title);
        setCompleted(tarea.completed);
    };

    const handleUpdateTarea = (e) => {
        e.preventDefault();
    
        const updatedTarea = { title, completed };
    
        axios.put(`${URL}/${editingTareaId}`, updatedTarea)
            .then(response => {
                const updatedTareas = tareas.map(tarea => {
                    if (tarea.id === editingTareaId) {
                        return { ...tarea, ...response.data };
                    } else {
                        return tarea;
                    }
                });
    
                setTareas(updatedTareas);
                setEditingTareaId(null);
                setTitle('');
                setCompleted(false);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar la tarea:', error);
            });
    };

//borrar tareas

    const handleDeleteTarea = (tareaId) => {
        axios.delete(`${URL}/${tareaId}`)
            .then(() => {
                const updatedTareas = tareas.filter(tarea => {
                    if (tarea.id !== tareaId) {
                        return true;
                    } else {
                        return false; 
                    }
                });
                setTareas(updatedTareas);
            })
            .catch(error => {
                console.error('Hubo un error al eliminar la tarea:', error);
            });
    };

    return (
        <div>
            <h1>Tareas</h1>

            <form onSubmit={(e) => {
                if (editingTareaId) {
                    handleUpdateTarea(e);
                } else {
                    handleAddTarea(e);
                }
            }}>
                <div>
                    <label>Tarea:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit">
                    {(() => {
                        if (editingTareaId) {
                            return 'Actualizar Tarea';
                        } else {
                            return 'Agregar Tarea';
                        }
                    })()}
                </button>

            </form>

            
              {tareas.map(tarea => (
                    <li key={tarea.id}>
                        <input
                            type="checkbox"
                            checked={tarea.completed}
                            onChange={() => setCompleted(!tarea.completed)}
                        />
                        {tarea.title}
                        <button onClick={() => handleEditTarea(tarea)}>Editar</button>
                        <button onClick={() => handleDeleteTarea(tarea.id)}>Eliminar</button>
                    </li>
              ))}
        </div>
    );
};

export default App;
