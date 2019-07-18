const expect = require('chai').expect
const app = require('../app')
const request = require('supertest')

describe('GET /apps', ()=>{
  it('if sort type is incorrect, returns 400 error', () => {
    const sort = 'fish'
    return request(app)
    .get('/apps')
    .query({sort})
    .expect(400, "Sort must be one of Rating or App")
  });
  it('returns an array of apps if filtered by genre', ()=>{
    return request(app)
    .get('/apps')
    .query({search: "action"})
    .expect(200)//should be OK request response
    .expect('Content-Type', /json/) //expect to return json object
    .then(res => {
      expect(res.body).to.be.an('array') //expect to be an array
      expect(res.body).to.have.lengthOf.at.least(1) //expect to have something
      expect(res.body[0]).to.include.keys('App', 'Category', 'Rating', 'Genres', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Last Updated', 'Current Ver', 'Android Ver')

    })
  })
  it('returns sorted array if sorted by rating', ()=>{
    
    return request(app)
    .get('/apps')
    .query({sort: 'App'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).to.be.an('array')
      let i = 0
      let sorted = true
      
      while(sorted && i < res.body.length-1){
        sorted = sorted && res.body[i]['App'] <= res.body[i+1]['App'];
        i++
      }
      expect(sorted).to.be.true
    })
  })
})