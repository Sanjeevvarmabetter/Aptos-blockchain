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
      const resultData = await aptosClient.getAccountResources({
        accountAddress: nftMarketPlaceAddress,
        resourceType: `${nftMarketPlaceAddress}::nft::State`,
      });

      // Log the entire response to inspect its structure
      console.log('Resource data:', resultData);

      // Ensure the nfts data exists and has the correct structure
      const nftStateResource = resultData.find(resource => resource.type === `${nftMarketPlaceAddress}::nft::State`);

      if (nftStateResource && nftStateResource.data && nftStateResource.data.nfts) {
        const fetchedItems = nftStateResource.data.nfts;
        const length = fetchedItems.length;

        // Initialize an array to store NFT items
        let tempItems = [];
        for (let i = 0; i < length; i++) {
          let uri = fetchedItems[i]["ipfs_hash"];

          // Fetch metadata from IPFS
          const response = await fetch(uri);
          const metadata = await response.json();

          // Map the metadata to an easier structure
          const itemToPush = {
            id: i.toString(),
            name: metadata.name,
            image: metadata.image, // Make sure to use the correct field here
            owner: metadata.owner,
            price: metadata.price.toString(),
          };
          tempItems.push(itemToPush);
        }

        // Set NFTs after fetching all metadata
        setNfts(tempItems);
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
                          {/* Assuming the IPFS hash can link to the image */}
                          <Card.Img
                              variant="top"
                              src={nft.image} // Use the image URL directly
                              alt={`NFT ${nft.id}`}
                          />
                          <Card.Body>
                            <Card.Title>{`NFT #${nft.id}`}</Card.Title>
                            {/*<Card.Text>{`Owner: ${nft.owner}`}</Card.Text>*/}
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
