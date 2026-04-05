
export default function SearchBar({setSearch}){
return(
<input placeholder="Search gifts..." onChange={e=>setSearch(e.target.value)} />
)
}
