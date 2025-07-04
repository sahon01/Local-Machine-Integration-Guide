"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Music, SkipBack, Shuffle, Plus, List, Heart } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  url: string
  favorite: boolean
}

interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
}

export function MP3Playlist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'আমার প্রিয় গান',
      songs: [
        {
          id: '1',
          title: 'নাশিদ ১',
          artist: 'শিল্পী ১',
          duration: 240,
          url: '',
          favorite: true
        },
        {
          id: '2',
          title: 'নাশিদ ২',
          artist: 'শিল্পী ২',
          duration: 180,
          url: '',
          favorite: false
        }
      ],
      createdAt: new Date()
    }
  ])

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(playlists[0] || null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [showAddSong, setShowAddSong] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newPlaylist, setNewPlaylist] = useState({
    name: ''
  })

  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    file: null as File | null
  })

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        playNext()
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [repeatMode])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const createPlaylist = () => {
    if (!newPlaylist.name.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "প্লেলিস্টের নাম দিন।",
        variant: "destructive"
      })
      return
    }

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      songs: [],
      createdAt: new Date()
    }

    setPlaylists(prev => [...prev, playlist])
    setSelectedPlaylist(playlist)
    setNewPlaylist({ name: '' })
    setShowCreatePlaylist(false)
    
    toast({
      title: "প্লেলিস্ট তৈরি হয়েছে! ✅",
      description: `"${playlist.name}" সফলভাবে তৈরি হয়েছে।`,
    })
  }

  const addSong = () => {
    if (!selectedPlaylist || !newSong.title.trim() || !newSong.file) {
      toast({
        title: "ত্রুটি!",
        description: "সব তথ্য পূরণ করুন এবং ফাইল নির্বাচন করুন।",
        variant: "destructive"
      })
      return
    }

    // Create URL for the audio file
    const audioUrl = URL.createObjectURL(newSong.file)
    
    // Get duration (this is a simplified approach)
    const audio = new Audio(audioUrl)
    audio.addEventListener('loadedmetadata', () => {
      const song: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist || 'অজানা শিল্পী',
        duration: Math.floor(audio.duration),
        url: audioUrl,
        favorite: false
      }

      setPlaylists(prev => prev.map(p => 
        p.id === selectedPlaylist.id 
          ? { ...p, songs: [...p.songs, song] }
          : p
      ))

      setSelectedPlaylist(prev => prev ? { ...prev, songs: [...prev.songs, song] } : null)
      setNewSong({ title: '', artist: '', file: null })
      setShowAddSong(false)
      
      toast({
        title: "গান যোগ হয়েছে! 🎵",
        description: `"${song.title}" প্লেলিস্টে যোগ হয়েছে।`,
      })
    })
  }

  const playSong = (song: Song) => {
    if (audioRef.current) {
      if (currentSong?.id === song.id && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setCurrentSong(song)
        audioRef.current.src = song.url
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const playNext = () => {
    if (!selectedPlaylist || !currentSong) return

    const currentIndex = selectedPlaylist.songs.findIndex(s => s.id === currentSong.id)
    let nextIndex = currentIndex + 1

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * selectedPlaylist.songs.length)
    } else if (nextIndex >= selectedPlaylist.songs.length) {
      nextIndex = repeatMode === 'all' ? 0 : currentIndex
    }

    if (nextIndex < selectedPlaylist.songs.length) {
      playSong(selectedPlaylist.songs[nextIndex])
    }
  }

  const playPrevious = () => {
    if (!selectedPlaylist || !currentSong) return

    const currentIndex = selectedPlaylist.songs.findIndex(s => s.id === currentSong.id)
    let prevIndex = currentIndex - 1

    if (prevIndex < 0) {
      prevIndex = repeatMode === 'all' ? selectedPlaylist.songs.length - 1 : 0
    }

    playSong(selectedPlaylist.songs[prevIndex])
  }

  const toggleFavorite = (songId: string) => {
    if (!selectedPlaylist) return

    setPlaylists(prev => prev.map(p => 
      p.id === selectedPlaylist.id 
        ? {
            ...p,
            songs: p.songs.map(s => 
              s.id === songId ? { ...s, favorite: !s.favorite } : s
            )
          }
        : p
    ))

    setSelectedPlaylist(prev => prev ? {
      ...prev,
      songs: prev.songs.map(s => 
        s.id === songId ? { ...s, favorite: !s.favorite } : s
      )
    } : null)
  }

  const deleteSong = (songId: string) => {
    if (!selectedPlaylist) return

    setPlaylists(prev => prev.map(p => 
      p.id === selectedPlaylist.id 
        ? { ...p, songs: p.songs.filter(s => s.id !== songId) }
        : p
    ))

    setSelectedPlaylist(prev => prev ? {
      ...prev,
      songs: prev.songs.filter(s => s.id !== songId)
    } : null)

    if (currentSong?.id === songId) {
      setCurrentSong(null)
      setIsPlaying(false)
    }

    toast({
      title: "গান মুছে ফেলা হয়েছে! 🗑️",
      description: "গান প্লেলিস্ট থেকে সরানো হয়েছে।",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const exportPlaylist = () => {
    if (!selectedPlaylist) return

    const playlistData = {
      name: selectedPlaylist.name,
      songs: selectedPlaylist.songs.map(song => ({
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        favorite: song.favorite
      }))
    }

    const dataStr = JSON.stringify(playlistData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedPlaylist.name}-playlist.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "প্লেলিস্ট এক্সপোর্ট হয়েছে! 📤",
      description: "প্লেলিস্ট ফাইল ডাউনলোড হয়েছে।",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">কাস্টম MP3 প্লেলিস্ট</h2>
          <p className="text-gray-600">আপনার প্রিয় গানের প্লেলিস্ট তৈরি এবং পরিচালনা করুন</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreatePlaylist(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            নতুন প্লেলিস্ট
          </Button>
          {selectedPlaylist && (
            <Button onClick={() => setShowAddSong(true)} variant="outline">
              <Music className="h-4 w-4 mr-2" />
              গান যোগ করুন
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Playlist Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              প্লেলিস্ট
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlaylist?.id === playlist.id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="font-medium text-sm">{playlist.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {playlist.songs.length} গান
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Now Playing */}
          {currentSong && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  এখন বাজছে
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{currentSong.title}</h3>
                    <p className="text-gray-600">{currentSong.artist}</p>
                  </div>
                  <Button
                    onClick={() => toggleFavorite(currentSong.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Heart className={`h-4 w-4 ${currentSong.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={currentSong.duration}
                    step={1}
                    onValueChange={(value) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = value[0]
                        setCurrentTime(value[0])
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentSong.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={() => setIsShuffled(!isShuffled)}
                    variant="outline"
                    size="sm"
                    className={isShuffled ? 'bg-blue-100' : ''}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={playPrevious} variant="outline" size="sm">
                    <SkipBack className="\
