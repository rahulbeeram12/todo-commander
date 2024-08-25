const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

program
    .name('TODO')
    .description('CLI for creating TODO\'s')
    .version('1.0.0');

program.command('addTodo')
    .description('Add a TODO and display all TODO\'s')
    .argument('<string>', 'string to add to TODO')
    .action((todoName) => {
        fs.readFile(path.join(__dirname, './todos.json'), 'utf-8', (err, data) => {
            if (err) throw new Error(err);

            const existingTodos = JSON.parse(data);
            existingTodos.forEach(todo => {
                if (todo.name === todoName) throw new Error("A TODO with this name already exists!");
            });

            const allTodos = [...existingTodos, { name: todoName, complete: false }];

            fs.writeFile(path.join(__dirname, './todos.json'), JSON.stringify(allTodos), (err) => {
                if (err) throw new Error(err);
                console.log("Added TODO successfully!");
            });
        });
    });

program.command('display')
    .description('Display all TODO\'s')
    .option('-c, --completed [type]', 'Display completed todos')
    .action((_, options) => {
        fs.readFile(path.join(__dirname, './todos.json'), 'utf-8', (err, data) => {
            if (err) throw new Error(err);

            const existingTodos = JSON.parse(data);
            if(options.completed === undefined) console.log(existingTodos);
            else console.log(existingTodos.filter(todo => todo.complete === true));
        });
    });

program.command('markComplete')
    .description('Mark a TODO complete!')
    .argument('<string>', 'Provide TODO name to mark it complete')
    .action((todoName) => {
        fs.readFile(path.join(__dirname, './todos.json'), 'utf-8', (err, data) => {
            if (err) throw new Error(err);

            const existingTodos = JSON.parse(data);
            let idx = -1;
            for (let i = 0; i < existingTodos.length; i++) {
                if (existingTodos[i].name === todoName) {
                    existingTodos[i].complete = true;
                    idx = i;
                    break;
                }
            }

            if (idx === -1) throw new Error(`Todo with this name "${todoName}" does not exist!`);

            fs.writeFile(path.join(__dirname, './todos.json'), JSON.stringify(existingTodos), (err) => {
                if (err) throw new Error(err);
                console.log(`Marked TODO ${todoName} successfully!`);
            });
        });
    });

program.command('deleteTodo')
    .description('Delete a given Todo with provided name')
    .argument('<string>', 'Give TODO name to delete')
    .action((todoName) => {
        fs.readFile(path.join(__dirname, './todos.json'), 'utf-8', (err, data) => {
            if (err) throw new Error(err);

            const existingTodos = JSON.parse(data);
            let idx = -1;
            for (let i = 0; i < existingTodos.length; i++) {
                if (existingTodos[i].name === todoName) {
                    idx = i;
                    break;
                }
            }
            if (idx === -1) throw new Error(`Todo with this name "${todoName}" does not exist!`);

            const allTodos = existingTodos.splice(idx, 1);

            fs.writeFile(path.join(__dirname, './todos.json'), JSON.stringify(allTodos), (err) => {
                if (err) throw new Error(err);
                console.log("Deleted TODO successfully!");
            });
        });
    });

program.parse();