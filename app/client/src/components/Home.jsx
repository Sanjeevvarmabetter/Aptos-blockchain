import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = ({ aptosClient, nftMarketPlaceAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    try {
      // Fetch the State resource from the NFT marketplace address
      const resource = await aptosClient.getAccountResource(
          nftMarketPlaceAddress,
          `${nftMarketPlaceAddress}::nft::State`
      );

      // Log the entire response to inspect its structure
      console.log('Resource data:', resource);

      // Check if the nfts data exists
      if (resource && resource.data && resource.data.nfts) {
        // Extracting NFTs and mapping them to an easier structure
        const nftList = resource.data.nfts.map((nft) => ({
          id: nft.id.toString(), // Ensure `id` is treated as a string
          owner: nft.owner,
          ipfs_hash: nft.ipfs_hash,
          price: nft.price.toString(), // Ensure price is a string for display
        }));

        setNfts(nftList);
      } else {
        toast.error('No NFTs found or failed to fetch NFTs.');
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast.error('Error fetching NFTs.');
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
                          {/* Assuming the IPFS hash can link to the image/video */}
                          <Card.Img
                              variant="top"
                              src={`https://ipfs.io/ipfs/${nft.ipfs_hash}`}
                              alt={`NFT ${nft.id}`}
                          />
                          <Card.Body>
                            <Card.Title>{`NFT #${nft.id}`}</Card.Title>
                            <Card.Text>{`Owner: ${nft.owner}`}</Card.Text>
                            <p>Price: {nft.price} APT</p>
                          </Card.Body>
                        </Card>
                      </Col>
                  ))
              ) : (
                  <p>No NFTs available</p>
              )}
            </Row>
        )}
        <ToastContainer />
      </div>
  );
};

export default Home;
