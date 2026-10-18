import { useEffect, useState } from "react";

const About = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.5:5047/api/productnames/all")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "red" }}>
      <h1>Products Table</h1>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.productNameID}>
              <td>{item.productNameID}</td>
              <td>{item.productName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default About;
