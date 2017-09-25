const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodosData = [{
            _id: new ObjectID(),
            text: "First dummy todo"
        },
        {
            _id: new ObjectID(),
            text: "second dummy todo"
        }];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodosData);
    }).then(() => {        
        done();
    }, (err) => {
        console.log('Error in adding test data: ', err);
        done();
    });
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done) => {
        var text = 'A task from Unit Test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, resp) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, resp) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });    
});

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);                
            })
            .end(done);
    });
});

describe('GET /todos/:id', ()=>{
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${testTodosData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                //expect(res.body.todo._id.toHexString()).toBe(testTodosData[0]._id.toHexString());  
                expect(res.body.todo.text).toBe(testTodosData[0].text);  
            })
            .end(done);
    });
})

describe('DELETE /todos/:id', ()=>{
    it('should delete todo doc', (done) => {
        request(app)
            .delete(`/todos/${testTodosData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {                
                expect(res.body.todo.text).toBe(testTodosData[0].text);  
            })
            .end(done);
    });

    it('should not delete invalid id', (done) => {
        request(app)
            .delete(`/todos/123456`)
            .expect(400)
            .end(done);});
    
    it('should return 404 on not found', (done) => {
        request(app)
            .delete(`/todos/59c90b3111d60851cf57eb62`)
            .expect(404)
            .end(done);});
})