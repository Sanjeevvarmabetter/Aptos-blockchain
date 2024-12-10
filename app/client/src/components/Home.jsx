import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = ({ aptosClient, nftMarketPlaceAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    try {
      const resource = await aptosClient.getAccountResource(
        nftMarketPlaceAddress,
        `${nftMarketPlaceAddress}::nft::State`
      );

      if (resource?.data?.nfts) {
        setNfts(resource.data.nfts);
      } else {
        toast.error("No NFTs found or failed to fetch NFTs.");
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Error fetching NFTs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="container mt-5">
      <h1>All NFTs</h1>
      {loading ? (
        <div>Loading NFTs...</div>
      ) : (
        <Row className="g-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <Col key={index} md={4}>
                <Card>
                  <Card.Img variant="top" src={nft.ipfs_hash} />
                  <Card.Body>
                    <Card.Title>{nft.name || `NFT #${index}`}</Card.Title>
                    <Card.Text>{nft.description || "No description provided."}</Card.Text>
                    <Card.Text>Price: {nft.price || "N/A"} APT</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div>No NFTs found</div>
          )}
        </Row>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
