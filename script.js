const fs = require('fs');
let content = fs.readFileSync('src/features/backlog/components/BacklogView.tsx', 'utf-8');

const replacement = \// 1. Check if board already exists
            const existingBoards = await boardService.findByGroupId(groupId);
            const existingBoard = existingBoards.find(b => b.title === sprint.name);
            
            let targetBoardId = '';
            let isReused = false;

            if (existingBoard) {
                targetBoardId = existingBoard.id;
                isReused = true;
            } else {
                // Create Board
                const board = await boardService.createBoard({
                    title: sprint.name,
                    description: \\\Tablero generado para \\\\\\,
                    groupId
                });
                targetBoardId = board.id;
                
                // Apply Template
                await templateService.applyTemplate(targetBoardId, exportSprintTemplateId);
            }

            // 3. Fetch columns to get the first one
            const response = await apiClient.get<{data: any[]}>(\\\/columns/board/\\\\\\);
            const cols = response.data.data || [];
            if (cols.length === 0) throw new Error('El tablero no generó columnas');

            const firstColumnId = cols[0]._id || cols[0].id;

            // 4. Export all cards to the first column
            for (const card of cards) {
                await sprintService.exportToBoard(card._id || card.id, firstColumnId);
            }

            if (isReused) {
                alert(\\\Se pasaron las tarjetas al tablero ya creado: \\\\\\);
            } else {
                alert('¡Sprint convertido a Tablero correctamente! Se han movido todas las tareas.');
            }
            
            setExportingSprintId(null);
            fetchData();
        } catch (error: any) {
            alert('Error al exportar el sprint: ' + error.message);
        } finally {
            setIsExportingCards(false);
        }\;

const startIndex = content.indexOf('// 1. Create Board');
const endIndexStr = 'setIsExportingCards(false);\\r\\n        }';
let endIndex = content.indexOf(endIndexStr);
if (endIndex === -1) endIndex = content.indexOf('setIsExportingCards(false);\\n        }');
if (endIndex === -1) endIndex = content.indexOf('setIsExportingCards(false);');

if(startIndex > -1 && endIndex > -1) {
   endIndex = endIndex + 'setIsExportingCards(false);'.length;
   // need to include the closing brace of finally
   const textAfter = content.substring(endIndex);
   const braceIndex = textAfter.indexOf('}');
   
   content = content.substring(0, startIndex) + replacement + textAfter.substring(braceIndex + 1);
   fs.writeFileSync('src/features/backlog/components/BacklogView.tsx', content);
   console.log('Success');
} else {
   console.log('Not found', startIndex, endIndex);
}
