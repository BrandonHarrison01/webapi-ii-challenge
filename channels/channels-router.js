const router = require('express').Router();

const posts = require("../data/db")
const comments = require("../data/db")


// add a new post

router.post('/', (req, res) => {
    const newPost = req.body;
    console.log('new post', newPost)

    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        posts.insert(newPost)
            .then(result => {
                console.log('new post result', result)
                res.status(201).json(result)
            })
            .catch(error => {
                console.log('post error', error)
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})


// post a new comment

router.post('/:id/comments', (req, res) => {
    const newComment = req.body;
    console.log('new comment', newComment)

    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        posts.insertComment(newComment)
            .then(comment => {
                if (comment) {
                    res.status(201).json(comment);
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }
})


// get all posts

router.get('/', (req, res) => {
    posts.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})


// get post by id

router.get('/:id', (req, res) => {
    const postId = req.params.id

    posts.findById(postId)
    .first()
        .then(post => {
            console.log('get post id', post)
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})


// get comment by post id

router.get('/:id/comments', (req, res) => {
    const postId = req.params.id
    console.log('post id', postId)

    posts.findPostComments(postId)
    .first()
        .then(comment => {
            console.log('comment', comment)
            if (comment) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})


// delete a post

router.delete('/:id', (req, res) => {
    const postId = req.params.id

    posts.remove(postId)
        .then(post => {
            if (post) {
                res.status(200).json({ message: 'post successfully deleted' })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed" })
        })
})


// edit a post

router.put('/:id', (req, res) => {
    const postId = req.params.id
    const changes = req.body
    console.log('post id', postId)

    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        posts.update(postId, changes)
            .then(updated => {
                if (updated) {
                    console.log('updated', updated)
                    res.status(200).json(changes)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                res.status(500).json({ error: "The post information could not be modified." })
            })
    }
})


module.exports = router