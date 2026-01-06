<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Crypto Tracker</title>
  <style>
    body {
      background-color: #0f172a;
      color: white;
      font-family: Arial, sans-serif;
      padding: 20px;
    }

    h2 {
      margin-bottom: 15px;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input {
      padding: 8px;
      width: 250px;
      border-radius: 5px;
      border: none;
      outline: none;
    }

    button {
      padding: 8px 12px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      background-color: #2563eb;
      color: white;
    }

    button:hover {
      background-color: #1d4ed8;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #334155;
    }

    img {
      vertical-align: middle;
    }
  </style>
</head>
<body>

  <h2>Crypto Market</h2>

  <div class="controls">
    <input
      type="text"
      id="search"
      placeholder="Search by Name or Symbol"
      oninput="handleSearch()"
    />
    <button onclick="sortByMarketCap()">Sort by Market Cap</button>
    <button onclick="sortByPercentage()">Sort by % Change</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Symbol</th>
        <th>Price</th>
        <th>Total Volume</th>
        <th>% Change</th>
        <th>Market Cap</th>
      </tr>
    </thead>
    <tbody id="table-body"></tbody>
  </table>

  <script>
    const API_URL =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

    let cryptoData = [];

    async function fetchCryptoData() {
      try {
        const res = await fetch(API_URL);
        cryptoData = await res.json();
        renderTable(cryptoData);
      } catch (err) {
        console.error(err);
      }
    }

    function renderTable(data) {
      const tbody = document.getElementById("table-body");
      tbody.innerHTML = "";

      data.forEach((coin) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td><img src="${coin.image}" width="25"></td>
          <td>${coin.name}</td>
          <td>${coin.symbol.toUpperCase()}</td>
          <td>$${coin.current_price}</td>
          <td>$${coin.total_volume.toLocaleString()}</td>
          <td style="color:${coin.price_change_percentage_24h >= 0 ? "lime" : "red"}">
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </td>
          <td>$${coin.market_cap.toLocaleString()}</td>
        `;

        tbody.appendChild(row);
      });
    }

    function handleSearch() {
      const value = document.getElementById("search").value.toLowerCase();

      const filtered = cryptoData.filter(
        (coin) =>
          coin.name.toLowerCase().includes(value) ||
          coin.symbol.toLowerCase().includes(value)
      );

      renderTable(filtered);
    }

    function sortByMarketCap() {
      const sorted = [...cryptoData].sort(
        (a, b) => b.market_cap - a.market_cap
      );
      renderTable(sorted);
    }

    function sortByPercentage() {
      const sorted = [...cryptoData].sort(
        (a, b) =>
          b.price_change_percentage_24h -
          a.price_change_percentage_24h
      );
      renderTable(sorted);
    }

    fetchCryptoData();
  </script>

</body>
</html>