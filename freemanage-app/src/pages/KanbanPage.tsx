import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface KanbanTask {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: number;
  parent_task_id: string | null;
  type: 'epic' | 'task' | 'subtask';
}

interface KanbanColumn {
  id: string;
  board_id: string;
  title: string;
  position: number;
  tasks: KanbanTask[];
}

interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
}

const KanbanPage: React.FC = () => {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder user_id since authentication is disabled
  // In a real app, this would come from auth.uid()
  const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000000'; 

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch board (assuming one board per user for simplicity for now)
      const { data: boards, error: boardError } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', DUMMY_USER_ID) // Filter by dummy user_id
        .limit(1);

      if (boardError) throw boardError;

      let currentBoard: KanbanBoard | null = null;
      if (boards && boards.length > 0) {
        currentBoard = { ...boards[0], columns: [] };
      } else {
        // If no board exists, create a default one
        const { data: newBoard, error: createBoardError } = await supabase
          .from('kanban_boards')
          .insert({ user_id: DUMMY_USER_ID, title: 'My First Kanban Board' })
          .select()
          .single();
        if (createBoardError) throw createBoardError;
        currentBoard = { ...newBoard, columns: [] };

        // Create default columns for the new board
        const defaultColumns = [
          { board_id: currentBoard.id, user_id: DUMMY_USER_ID, title: 'To Do', position: 0 },
          { board_id: currentBoard.id, user_id: DUMMY_USER_ID, title: 'In Progress', position: 1 },
          { board_id: currentBoard.id, user_id: DUMMY_USER_ID, title: 'Done', position: 2 },
        ];
        const { data: newColumns, error: createColumnsError } = await supabase
          .from('kanban_columns')
          .insert(defaultColumns)
          .select();
        if (createColumnsError) throw createColumnsError;
        currentBoard.columns = newColumns || [];
      }

      // Fetch columns for the board
      const { data: columns, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('board_id', currentBoard.id)
        .order('position', { ascending: true });

      if (columnsError) throw columnsError;

      // Fetch tasks for all columns
      const { data: tasks, error: tasksError } = await supabase
        .from('kanban_tasks')
        .select('*')
        .in('column_id', columns ? columns.map(col => col.id) : [])
        .order('position', { ascending: true });

      if (tasksError) throw tasksError;

      // Organize tasks into columns
      const columnsWithTasks = columns ? columns.map(col => ({
        ...col,
        tasks: tasks ? tasks.filter(task => task.column_id === col.id) : [],
      })) : [];

      setBoard({ ...currentBoard, columns: columnsWithTasks });

    } catch (err: any) {
      console.error('Error fetching kanban data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Logic to handle drag and drop (reordering within column or moving between columns)
    // This will be implemented in the next step
    console.log(`Task ${draggableId} moved from column ${source.droppableId} at index ${source.index} to column ${destination.droppableId} at index ${destination.index}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Kanban Board...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!board) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">No Kanban Board found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{board.title}</h1>
        {/* Add buttons for adding columns/tasks later */}
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 overflow-x-auto">
          {board.columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-800 rounded-lg p-4 w-80 flex-shrink-0"
                >
                  <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                  <div className="space-y-4">
                    {column.tasks.map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 p-3 rounded-md shadow"
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-gray-400 text-sm">{task.description}</p>
                            {/* Display type and parent_task_id later */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;