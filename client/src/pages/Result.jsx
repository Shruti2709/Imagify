import React,{useState} from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Result = () => {

  const [image,setImage]=useState(assets.sample_img_1)

  const[isImageLoaded,setIsImageLoaded]=useState(false)

  const [loading,setLoading]=useState(false)

  const[input,setInput]=useState('')

  const [imageId, setImageId] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  const [templates, setTemplates] = useState([])

  const { generateImage, selectedModel, setSelectedModel, availableModels, getTemplates, toggleFavorite, togglePublic } = useContext(AppContext)

  useEffect(() => {
    (async () => {
      const data = await getTemplates()
      setTemplates(data)
    })()
  }, [])

  const onSubmitHandler=async(e)=>{

    e.preventDefault()
    setLoading(true)

    if(input){
      const result=await generateImage(input)

      if(result && result.resultImage){
        setIsImageLoaded(true)
        setImage(result.resultImage)
        setImageId(result.imageId)
        setIsFavorite(false)
        setIsPublic(false)
      }
    }
    setLoading(false)

  }

  const handleTemplateSelect = (e) => {
    const tpl = templates.find(t => t.id === e.target.value)
    if (tpl) setInput(tpl.prompt)
  }

  const handleFavoriteClick = async () => {
    if (!imageId) return
    const fav = await toggleFavorite(imageId)
    setIsFavorite(fav)
    if (fav) toast.success('Added to favorites')
  }

  const handlePublicClick = async () => {
    if (!imageId) return
    const pub = await togglePublic(imageId)
    setIsPublic(pub)
    if (pub) toast.success('Shared to public gallery')
  }

  return (
    <motion.form 

       initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    
    onSubmit={onSubmitHandler} className='flex flex-col items-center min-h-[90vh] justify- center' >

    {!isImageLoaded && (
      <div className='flex flex-wrap gap-3 justify-center mb-4 w-full max-w-xl'>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className='border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm'
        >
          {availableModels.length === 0 && <option value='clipdrop'>Clipdrop (Stable Diffusion)</option>}
          {availableModels.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        <select
          defaultValue=''
          onChange={handleTemplateSelect}
          className='border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm'
        >
          <option value='' disabled>Use a prompt template...</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.category} — {t.title}</option>
          ))}
        </select>
      </div>
    )}
    
    <div>
      <div className='relative'>
    <img src={image} alt="" className='max-w-sm rounded'/>
   <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
      </div>
      <p className={!loading ? 'hidden' : ''}>Loading.....</p>

    </div>
    {!isImageLoaded &&
    <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 rounded-full mt-10'>
    <input onChange={e=>setInput(e.target.value)} value={input} type="text" placeholder='Describe what you want to generate' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
    <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
    </div>
}

{isImageLoaded &&
  <>
    <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      <p onClick={()=>{
        setIsImageLoaded((false))
      }} className='bg-transparent border border-zinc-900 text-black dark:text-white px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>

    </div>
    <div className='flex gap-2 flex-wrap justify-center text-sm mt-4'>
      <button type='button' onClick={handleFavoriteClick} className={`px-6 py-2 rounded-full border ${isFavorite ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-400 text-gray-700 dark:text-gray-200'}`}>
        {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
      </button>
      <button type='button' onClick={handlePublicClick} className={`px-6 py-2 rounded-full border ${isPublic ? 'bg-green-500 text-white border-green-500' : 'border-gray-400 text-gray-700 dark:text-gray-200'}`}>
        {isPublic ? 'Shared to Gallery' : 'Share to Public Gallery'}
      </button>
    </div>
  </>
}
     </motion.form>
  )
}

export default Result
