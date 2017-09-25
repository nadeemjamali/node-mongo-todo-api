const expect = require("expect");
const request = require("supertest");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodosData = [{
            text: "First dummy todo"
        },
        {
            text: "second dummy todo"
        }];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodosData);
    }).then(() => done());
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