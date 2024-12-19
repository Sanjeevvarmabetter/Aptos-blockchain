import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function Create({ moduleName, moduleAddress, connected, account, client }) {

  const { signAndSubmitTransaction } = useWallet();

  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Change to image file
  const [forminfo, setFormInfo] = useState({
    title: "",
    image: "", // Image instead of thumbnail
    price: 0,
    owner: "",
  });

  useEffect(() => {
    document.title = "Create"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event) => {
    setImageFile(event.target.files[0]); // Handle image files instead of video
  };

  const handleEvent = async (e) => {
    e.preventDefault();
    forminfo.owner = account.address;
    if (!imageFile) {
      toast.error("Upload image!", {
        position: "top-center"
      })
      return
    }
    setTransactionInProgress(true);

    const formData = new FormData();
    const jsonformData = new FormData();

    formData.append('file', imageFile);
    console.log(imageFile);

    const metadata = JSON.stringify({
      name: forminfo.title,
    });
    jsonformData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    jsonformData.append('pinataOptions', options);

    try {
      toast.info("Uploading image to IPFS", {
        position: "top-center"
      });
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `20a1ac93e10b67f081c5`,
          pinata_secret_api_key: `2b3680b650e07a507c4df5a9649b9b6438d7f8e4c3cc0cfab22a73bb968d02d7`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("image: ", resFile.data);
      const imageHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      const info = {
        name: forminfo.title,
        description: forminfo.description,
        image: imageHash, // Update to use imageHash
        owner: forminfo.owner,
        price: forminfo.price,
      };
      toast.info("Pinning metadata to IPFS", {
        position: "top-center"
      });

      async function pinJSONToPinata(info) {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        const headers = {
          'Content-Type': 'application/json',
          'pinata_api_key': `20a1ac93e10b67f081c5`,
          'pinata_secret_api_key': `2b3680b650e07a507c4df5a9649b9b6438d7f8e4c3cc0cfab22a73bb968d02d7`
        };

        try {
          const res = await axios.post(url, info, { headers });
          const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
          console.log("meta: ", meta);
          console.log("minting...");
          mintThenList(meta);

        } catch (error) {
          toast.error("Error minting NFT", {
            position: "top-center"
          })
          setTransactionInProgress(false);
          console.error(error);
        }

      }

      pinJSONToPinata(info)

    } catch (error) {
      toast.error("Error minting NFT", {
        position: "top-center"
      })
      setTransactionInProgress(false);
      console.log(error);
    }

  };

  const mintThenList = async (uri) => {
    toast.info("Confirm to Mint the NFT", {
      position: "top-center"
    })

    try {
      const listingPrice = Math.round(10 ** 8 * forminfo.price);

      const payload = {
        data: {
          function: `${moduleAddress}::${moduleName}::add_nft`,
          functionArguments: [uri, listingPrice]
        }
      }
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
      toast.success("NFT minted successfully", { position: "top-center" })
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: "top-center"
      })
    }

    setTransactionInProgress(false)

  }

  return (
      <div className='h-screen pt-24'>
        <div className="container-fluid mt-5 text-left">
          <div className="content mx-auto">
            <form className="max-w-sm mx-auto">
              <div className='max-w-lg mx-auto'>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file">Upload Image</label>
                <input onChange={changeHandler} name="file" className="block w-full mb-4 h-8 text-m text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" accept='.jpeg,.jpg,.png' />
              </div>

              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NFT Name</label>
                <input onChange={handleChange} type="text" id="title" name='title' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter NFT name" required />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <input onChange={handleChange} type="number" id="price" name='price' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter price in APT" required />
              </div>

              <div className='text-center'>
                <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" disabled={!connected || transactionInProgress}>
                  Mint NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Create;
