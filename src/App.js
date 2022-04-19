import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { ToastContainer } from "react-toastify";
import http from "./services/httpService";
import config from "./config.json";
import logo from "./logo.svg";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data: posts } = await http.get(config.apiEndpoint);

      setPosts(posts);
    };
    getData();
  }, []);

  const handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);

    const addPosts = [post, ...posts];
    setPosts(addPosts);
  };

  const handleUpdate = async (post) => {
    post.title = "UPDATED";
    const { data } = await http.put(`${config.apiEndpoint}/${post.id}`, post);
    // axios.patch(`${apiEndpoint}${post.id}`, { title: post.title });
    const updatePosts = [...posts];
    const index = updatePosts.indexOf(post);
    posts[index] = { ...post };
    setPosts(updatePosts);
  };

  const handleDelete = async (post) => {
    //Optimistic update
    // 1- keep a reference to orignal state
    const originalPosts = posts;

    // 2- you update the url before calling the server
    const deletePost = posts.filter((p) => p.id !== post.id);
    setPosts(deletePost);

    // 3- wrap the call to the server in try & catch block
    try {
      await http.delete(`${config.apiEndpoint}/${post.id}`);
      // throw new Error("");
    } catch (err) {
      if (err.response && err.response.status === 404)
        alert(`This post has already been deleted`);

      setPosts(originalPosts);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <button className="btn btn-primary" onClick={handleAdd}>
        Add
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleUpdate(post)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default Sentry.withProfiler(App);
