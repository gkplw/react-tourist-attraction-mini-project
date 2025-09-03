import { useState, useEffect } from "react";
import axios from "axios";

function TravelSearch() {
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  async function getData() {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${text}`
      );
      setData(response.data.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  useEffect(() => {
    getData();
  }, [text]);

  function handleClick(tag) {
    const currentTags = text.split(" ").filter(Boolean);
    if (!currentTags.includes(tag)) {
      setText([...currentTags, tag].join(" "));
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <h1 className="header">เที่ยวไหนดี</h1>

      <div>ค้นหาที่เที่ยว</div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="หาที่เที่ยวแล้วไปกัน ..."
          className="search-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      {/* ✅ แสดง error ถ้ามี */}
      {errorMessage ? (
        <div className="error-box">
          <p>{errorMessage}</p>
          <button onClick={getData}>ลองใหม่</button>
        </div>
      ) : (
        <div className="article-list">
          {data.map((item) => (
            <div key={item.eid} className="article-item">
              {/* main image */}
              <img
                src={item.photos[0]}
                alt={item.title}
                className="main-image"
              />

              {/* content */}
              <div className="content">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className="content-title">{item.title}</h2>
                </a>

                {/* description limit 100 */}
                <p className="content-description">
                  {item.description.length > 100
                    ? item.description.slice(0, 100) + " ..."
                    : item.description}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  อ่านต่อ
                </a>

                {/* tags */}
                <div className="tags-container">
                  <span className="tag-divider">หมวด </span>
                  {item.tags.map((tag, i) => (
                    <span key={i}>
                      <button
                        className="tag"
                        onClick={() => handleClick(tag)}
                      >
                        {tag}
                      </button>
                      {i < item.tags.length - 2 && " "}
                      {i === item.tags.length - 2 && " และ "}
                    </span>
                  ))}
                </div>

                {/* sub images */}
                <div className="sub-images">
                  {item.photos.slice(1, 4).map((src, i) => (
                    <img key={i} src={src} alt="sub" className="sub-image" />
                  ))}
                </div>
              </div>

              {/* link icon */}
              <div className="link-button-container">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.url);
                    alert("คัดลอกลิงก์เรียบร้อย");
                  }}
                  className="link-button"
                >
                  🔗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TravelSearch;
