import './App.scss'
import React from 'react'
import { ethers } from 'ethers'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../hooks/context'
import { CyclimateHome } from '../CyclimateHome'
import { CyclimateMenu } from '../../shared/CyclimateMenu'
import { CyclimateWallet } from '../../shared/CyclimateMenu/CyclimateWallet'
import { CyclimateMaker } from '../CyclimateMaker'
import { CyclimateFooter } from '../../shared/CyclimateFooter'
import { CyclimateMarketplace } from '../CyclimateMarketplace'
import { CyclimateEventDetails } from '../CyclimateHome/CyclimateEventDetails'
import { CyclimateFaucet } from '../CyclimateFaucet'
import { CyclimateGateway } from '../CyclimateGatway'
import { CyclimateApprove } from '../CyclimateApprove'
import { firebaseApi } from '../../middleware/firebaseApi'
import { CyclimateLoading } from '../../shared/CyclimateLoading'
import { CyclimateDashboard } from '../CyclimateDashboard'

function App () {
  const auth = useAuth()
  const { getAllItems, getItem, createItem } = firebaseApi()
  const [items, setItems] = React.useState()
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [sincronizedItems, setSincronizedItems] = React.useState(true)

  const fetchData = async () => {
    try {
      setItems(await getAllItems())
      setLoading(false)
      setSincronizedItems(true)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error(error)
    }
  }

  React.useEffect(() => {
    fetchData()
    const currentNetwork = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const web3Signer = web3Provider.getSigner()
      const chainId = await web3Signer.getChainId()
      return chainId
    }
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        currentNetwork().then((response) => {
          if (response !== 43113) {
            auth.logout()
          }
        })
      })
      window.ethereum.on('accountsChanged', () => {
        auth.logout()
      })
    }
  }, [sincronizedItems])

  return (
    <>
      {loading
        ? (
          <div className='main__loading'>
            <CyclimateLoading />
          </div>
          )
        : (
          <>
            <CyclimateMenu>
              <CyclimateWallet />
            </CyclimateMenu>
            <main>
              <Routes>
                <Route
                  path='/'
                  element={
                    <CyclimateHome
                      items={items}
                      loading={loading}
                      error={error}
                    />
                }
                />
                <Route
                  path='/:slug'
                  element={<CyclimateEventDetails getItem={getItem} />}
                />
                <Route
                  path='/maker'
                  element={
                    <CyclimateMaker
                      createItem={createItem}
                      setSincronizedItems={setSincronizedItems}
                    />
                }
                />
                <Route path='/marketplace' element={<CyclimateMarketplace />} />
                <Route path='/gateway' element={<CyclimateGateway />} />
                <Route path='/faucet' element={<CyclimateFaucet />} />
                <Route path='/dashboard' element={<CyclimateDashboard />} />
                <Route
                  path='/approve/:slug'
                  element={<CyclimateApprove getItem={getItem} />}
                />
                <Route path='*' element={<Navigate replace to='/' />} />
              </Routes>
            </main>
            <CyclimateFooter />
          </>
          )}
    </>
  )
}

export default App
