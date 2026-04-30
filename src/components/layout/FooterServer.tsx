import { db } from "@/lib/db"
import { Footer } from "./Footer"

/** Server component that fetches footer settings from the database. */
export async function FooterServer() {
    const settingsDb = await db.siteSetting.findMany()
    const settings = settingsDb.reduce((acc, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {} as Record<string, string>)

    return <Footer settings={settings} />
}
